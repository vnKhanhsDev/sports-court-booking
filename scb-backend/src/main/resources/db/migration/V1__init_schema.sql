CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    password VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account_roles (
    account_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id, role),
    CONSTRAINT fk_account_roles_account FOREIGN KEY(account_id) REFERENCES accounts(id)
);

CREATE TABLE user_profiles (
    account_id UUID PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    gender VARCHAR(10),
    dob DATE,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_account FOREIGN KEY(account_id) REFERENCES accounts(id)
);

CREATE TABLE player_infos (
    account_id UUID PRIMARY KEY,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_player_infos_account FOREIGN KEY(account_id) REFERENCES accounts(id)
);

CREATE TABLE owner_infos (
    account_id UUID PRIMARY KEY,
    business_name VARCHAR(255),
    tax_code VARCHAR(20),
    license_front_url VARCHAR(255),
    license_back_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_owner_infos_account FOREIGN KEY(account_id) REFERENCES accounts(id)
);

/* ==========================================================================
   1. ADDRESS TABLES (Đơn vị hành chính) - MỚI
   ========================================================================== */

CREATE TABLE provinces (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code_name VARCHAR(255) -- Mapping từ field 'codeName' trong Java
);

CREATE TABLE districts (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code_name VARCHAR(255),
    province_code VARCHAR(20) NOT NULL,
    CONSTRAINT fk_districts_province FOREIGN KEY(province_code) REFERENCES provinces(code)
);

CREATE TABLE wards (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code_name VARCHAR(255),
    district_code VARCHAR(20) NOT NULL,
    CONSTRAINT fk_wards_district FOREIGN KEY(district_code) REFERENCES districts(code)
);

/* ==========================================================================
   2. CATALOG TABLES (Danh mục thể thao)
   ========================================================================== */

CREATE TABLE sports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE court_types (
    id BIGSERIAL PRIMARY KEY,
    sport_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_court_types_sport FOREIGN KEY(sport_id) REFERENCES sports(id)
);

CREATE TABLE surface_types (
    id BIGSERIAL PRIMARY KEY,
    sport_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_surface_types_sport FOREIGN KEY(sport_id) REFERENCES sports(id)
);

/* ==========================================================================
   3. FACILITY TABLES (Cơ sở sân bãi) - CẬP NHẬT FK ĐỊA CHỈ
   ========================================================================== */

CREATE TABLE facilities (
    id BIGSERIAL PRIMARY KEY,
    owner_account_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,

    -- Cập nhật Foreign Keys cho địa chỉ
    province_code VARCHAR(20),
    district_code VARCHAR(20),
    ward_code VARCHAR(20),

    address_detail VARCHAR(255),
    geo_latitude DOUBLE PRECISION,
    geo_longitude DOUBLE PRECISION,
    status VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_facilities_owner FOREIGN KEY(owner_account_id) REFERENCES owner_infos(account_id),
    CONSTRAINT fk_facilities_province FOREIGN KEY(province_code) REFERENCES provinces(code),
    CONSTRAINT fk_facilities_district FOREIGN KEY(district_code) REFERENCES districts(code),
    CONSTRAINT fk_facilities_ward FOREIGN KEY(ward_code) REFERENCES wards(code)
);

-- Bảng trung gian Many-to-Many giữa Facility và Sport
CREATE TABLE facility_sports (
    facility_id BIGINT NOT NULL,
    sport_id BIGINT NOT NULL,
    PRIMARY KEY (facility_id, sport_id),
    CONSTRAINT fk_facility_sports_facility FOREIGN KEY(facility_id) REFERENCES facilities(id),
    CONSTRAINT fk_facility_sports_sport FOREIGN KEY(sport_id) REFERENCES sports(id)
);

/* ==========================================================================
   4. PRICING TABLES (Bảng giá)
   ========================================================================== */

CREATE TABLE price_lists (
    id BIGSERIAL PRIMARY KEY,
    owner_info_id UUID NOT NULL,
    facility_id BIGINT,
    sport_id BIGINT,
    court_type_id BIGINT,
    surface_type_id BIGINT,
    court_id BIGINT,
    name VARCHAR(100),
    note TEXT,
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_price_lists_owner FOREIGN KEY(owner_info_id) REFERENCES owner_infos(account_id),
    CONSTRAINT fk_price_lists_facility FOREIGN KEY(facility_id) REFERENCES facilities(id),
    CONSTRAINT fk_price_lists_sport FOREIGN KEY(sport_id) REFERENCES sports(id),
    CONSTRAINT fk_price_lists_court_type FOREIGN KEY(court_type_id) REFERENCES court_types(id),
    CONSTRAINT fk_price_lists_surface_type FOREIGN KEY(surface_type_id) REFERENCES surface_types(id)
);

CREATE TABLE price_slots (
    id BIGSERIAL PRIMARY KEY,
    price_list_id BIGINT NOT NULL,
    from_time TIME NOT NULL,
    to_time TIME NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_price_slots_pricelist FOREIGN KEY(price_list_id) REFERENCES price_lists(id)
);

/* ==========================================================================
   5. COURT TABLES (Sân con)
   ========================================================================== */

CREATE TABLE courts (
    id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL,
    sport_id BIGINT NOT NULL,
    court_type_id BIGINT NOT NULL,
    surface_type_id BIGINT NOT NULL,
    price_list_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courts_facility FOREIGN KEY(facility_id) REFERENCES facilities(id),
    CONSTRAINT fk_courts_sport FOREIGN KEY(sport_id) REFERENCES sports(id),
    CONSTRAINT fk_courts_court_type FOREIGN KEY(court_type_id) REFERENCES court_types(id),
    CONSTRAINT fk_courts_surface_type FOREIGN KEY(surface_type_id) REFERENCES surface_types(id),
    CONSTRAINT fk_courts_pricelist FOREIGN KEY(price_list_id) REFERENCES price_lists(id)
);

-- Cập nhật FK vòng lặp giữa price_lists và courts
ALTER TABLE price_lists
    ADD CONSTRAINT fk_price_lists_court FOREIGN KEY(court_id) REFERENCES courts(id);

CREATE TABLE court_images (
    id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_court_images_court FOREIGN KEY(court_id) REFERENCES courts(id)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    player_account_id UUID NOT NULL,
    facility_id BIGINT NOT NULL,
    court_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    deposit_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_player FOREIGN KEY(player_account_id) REFERENCES player_infos(account_id),
    CONSTRAINT fk_bookings_facility FOREIGN KEY(facility_id) REFERENCES facilities(id),
    CONSTRAINT fk_bookings_court FOREIGN KEY(court_id) REFERENCES courts(id)
);

CREATE INDEX idx_booking_conflict_active
    ON bookings (court_id, booking_date, start_time, end_time)
    WHERE status IN ('PENDING', 'CONFIRMED');

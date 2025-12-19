package com.example.scbbackend.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ApiCode {

    /* SUCCESS */
    VERIFY_OTP_SUCCESS(2000, "Verify otp successfully", HttpStatus.OK),
    RESEND_OTP_SUCCESS(2001, "Resend otp successfully", HttpStatus.OK),
    REGISTER_AVAILABILITY(2000, "Register availability", HttpStatus.OK),
    REGISTER_SUCCESS(2001, "Register successfully", HttpStatus.OK),
    LOGIN_SUCCESS(2002, "Login successfully", HttpStatus.OK),
    GET_FACILITIES_WITH_COURTS_SUCCESS(2003, "Get facilities with courts successfully", HttpStatus.OK),
    GET_CATALOG_SUCCESS(2004, "Get catalog successfully", HttpStatus.OK),
    UPLOAD_MEDIA_SUCCESS(2005, "Upload media successfully", HttpStatus.OK),
    GET_ALL_PRICE_TEMPLATES_SUCCESS(2006, "Get all price templates successfully", HttpStatus.OK),
    GET_PRICE_TEMPLATE_SUCCESS(2007, "Get price template successfully", HttpStatus.OK),
    GET_PRICE_TEMPLATE_ITEMS_SUCCESS(2009, "Get price template items successfully", HttpStatus.OK),
    CREATE_PRICE_TEMPLATE_SUCCESS(2010, "Create price template successfully", HttpStatus.OK),
    UPDATE_PRICE_TEMPLATE_SUCCESS(2011, "Update price template successfully", HttpStatus.OK),
    DELETE_PRICE_TEMPLATE_SUCCESS(2012, "Delete price template successfully", HttpStatus.OK),
    GET_FACILITIES_SUCCESS(2013, "Get facilities successfully", HttpStatus.OK),
    GET_ALL_PRICE_TEMPLATE_OPTIONS_SUCCESS(2014, "Get price template options successfully", HttpStatus.OK),
    GET_ALL_PROVINCES_SUCCESS(2015, "Get all provinces successfully", HttpStatus.OK),
    GET_DISTRICTS_SUCCESS(2016, "Get districts successfully", HttpStatus.OK),
    GET_WARDS_SUCCESS(2017, "Get wards successfully", HttpStatus.OK),
    CREATE_FACILITY_SUCCESS(2018, "Create facility successfully", HttpStatus.OK),
    UPDATE_FACILITY_SUCCESS(2019, "Update facility successfully", HttpStatus.OK),
    DELETE_FACILITY_SUCCESS(2019, "Delete facility successfully", HttpStatus.OK),
    GET_FACILITY_SUCCESS(2019, "Get facility successfully", HttpStatus.OK),
    GET_ALL_COURTS_SUCCESS(2019, "Get all courts successfully", HttpStatus.OK),
    GET_COURT_SUCCESS(2019, "Get court successfully", HttpStatus.OK),
    CREATE_COURT_SUCCESS(2020, "Create court successfully", HttpStatus.OK),
    UPDATE_COURT_SUCCESS(2021, "Update court successfully", HttpStatus.OK),
    DELETE_COURT_SUCCESS(2022, "Delete court successfully", HttpStatus.OK),

    GET_ALL_PRICE_LISTS_SUCCESS(2023, "Get all price lists successfully", HttpStatus.OK),
    GET_PRICE_LIST_SUCCESS(2024, "Get price list successfully", HttpStatus.OK),
    GET_PRICE_LIST_OPTIONS_SUCCESS(2025, "Get price list options successfully", HttpStatus.OK),
    CREATE_PRICE_LIST_SUCCESS(2025, "Create price list successfully", HttpStatus.OK),
    UPDATE_PRICE_LIST_SUCCESS(2026, "Update price list successfully", HttpStatus.OK),
    DELETE_PRICE_LIST_SUCCESS(2027, "Delete price list successfully", HttpStatus.OK),

    GET_ALL_ADMIN_FACILITIES_SUCCESS(2028, "Get all admin facilities successfully", HttpStatus.OK),
    APPROVE_FACILITY_SUCCESS(2029, "Approve facility successfully", HttpStatus.OK),
    REJECT_FACILITY_SUCCESS(2030, "Reject facility successfully", HttpStatus.OK),
    APPROVE_ALL_FACILITIES_SUCCESS(2031, "Approve all facilities successfully", HttpStatus.OK),


    /* BUSINESS ERRORS */
    INPUT_INVALID(1000, "Input invalid", HttpStatus.BAD_REQUEST),
    GENDER_INVALID(1000, "Gender invalid", HttpStatus.BAD_REQUEST),
    ROLE_INVALID(1000, "Role invalid", HttpStatus.BAD_REQUEST),
    ACCOUNT_EXISTED(1001, "Account existed", HttpStatus.BAD_REQUEST),
    OTP_CHANNEL_INVALID(1000, "Otp channel invalid", HttpStatus.BAD_REQUEST),
    OTP_INVALID(1000, "Otp invalid", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(1000, "Otp expired", HttpStatus.BAD_REQUEST),
    OTP_MAX_ATTEMPTS(1000, "Otp max attempts", HttpStatus.BAD_REQUEST),
    OTP_INCORRECT(1000, "Otp incorrect", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_FOUND(1001, "Account not found", HttpStatus.NOT_FOUND),
    PASSWORD_INCORRECT(1002, "Password incorrect", HttpStatus.BAD_REQUEST),
    ACCOUNT_BANNED(1003, "Account banned", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_INVALID(1004, "Refresh token invalid", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_EXPIRED(1004, "Refresh token expired", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID(1005, "Token invalid", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1005, "Token expired", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1005, "Unauthorized", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1005, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    USER_NOT_FOUND(1006, "User not found", HttpStatus.NOT_FOUND),
    PRICE_TEMPLATE_NOT_FOUND(1007, "Price template not found", HttpStatus.NOT_FOUND),
    PRICE_TEMPLATE_IN_USE(1008, "Price template is being used by a court and cannot be deleted", HttpStatus.BAD_REQUEST),
    PROVINCE_NOT_FOUND(1009, "Province not found", HttpStatus.NOT_FOUND),
    DISTRICT_NOT_FOUND(10010, "District not found", HttpStatus.NOT_FOUND),
    WARD_NOT_FOUND(10011, "Ward not found", HttpStatus.NOT_FOUND),
    FACILITY_NOT_FOUND(10012, "Facility not found", HttpStatus.NOT_FOUND),
    FACILITY_HAS_COURTS(10020, "Facility has courts and cannot be deleted", HttpStatus.BAD_REQUEST),
    FACILITY_HAS_PRICE_LISTS(10021, "Facility is referenced by price lists and cannot be deleted", HttpStatus.BAD_REQUEST),
    COURT_PRICE_INPUT_INVALID(10013, "Court price input invalid", HttpStatus.BAD_REQUEST),
    SPORT_NOT_FOUND(10014, "Sport not found", HttpStatus.NOT_FOUND),
    COURT_TYPE_NOT_FOUND(10015, "Court type not found", HttpStatus.NOT_FOUND),
    SURFACE_TYPE_NOT_FOUND(10016, "Surface type not found", HttpStatus.NOT_FOUND),
    COURT_NOT_FOUND(10017, "Court not found", HttpStatus.NOT_FOUND),

    PRICE_LIST_NOT_FOUND(10018, "Price list not found", HttpStatus.NOT_FOUND),
    PRICE_LIST_IN_USE(10019, "Price list in use", HttpStatus.BAD_REQUEST),

    /* SYSTEM ERRORS */

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

}

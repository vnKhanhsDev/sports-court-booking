/**
 * Booking Request - data sent to backend for creating a booking
 */
export interface BookingRequest {
    courtId: number;
    facilityId: number;
    startTime: string; // LocalTime format: "HH:mm:ss"
    endTime: string; // LocalTime format: "HH:mm:ss"
    bookingDate: string; // LocalDate format: "YYYY-MM-DD"
    daysOfWeek?: number[]; // For fixed schedule: [1, 3, 5] for Monday, Wednesday, Friday
    scheduleType: "oddDays" | "fixedDays";
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes?: string;
    totalPrice: number;
    paymentMethod: "banking" | "momo" | "vnpay" | "cash";
}

/**
 * Booking Response - data returned from backend after creating a booking
 */
export interface BookingResponse {
    id: string;
    courtId: number;
    facilityId: number;
    startTime: string;
    endTime: string;
    bookingDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}

/**
 * Player Booking Response - detailed booking info for player's booking list
 */
export interface PlayerBookingResponse {
    id: string;
    courtId: number;
    courtName: string;
    facilityId: number;
    facilityName: string;
    facilityAddress: string;
    startTime: string;
    endTime: string;
    bookingDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}

/**
 * Owner Booking Response - detailed booking info for owner's booking management
 */
export interface OwnerBookingResponse {
    id: string;
    courtId: number;
    courtName: string;
    facilityId: number;
    facilityName: string;
    playerName: string;
    playerPhone: string;
    playerEmail: string;
    startTime: string;
    endTime: string;
    bookingDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}

/**
 * Booking Status
 */
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "EXPIRED";

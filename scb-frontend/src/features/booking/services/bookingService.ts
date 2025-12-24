import { publicClient } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { BookingRequest, BookingResponse, PlayerBookingResponse } from "../types/booking.types";
import type { ApiResponse } from "@/lib/axios";

export const bookingService = {
    createBooking: async (data: BookingRequest): Promise<BookingResponse> => {
        const response = await publicClient.post<ApiResponse<BookingResponse>>(
            ENDPOINTS.PUBLIC.BOOKING.CREATE,
            data
        );
        
        // Check if the response indicates an error
        if (!response.data.success || !response.data.data) {
            const errorMessage = response.data.message || "Đặt sân thất bại. Vui lòng thử lại.";
            throw new Error(errorMessage);
        }
        
        return response.data.data;
    },

    getMyBookings: async (): Promise<PlayerBookingResponse[]> => {
        const response = await publicClient.get<ApiResponse<PlayerBookingResponse[]>>(
            ENDPOINTS.BOOKING.MY_BOOKINGS
        );
        return response.data.data || [];
    },
};


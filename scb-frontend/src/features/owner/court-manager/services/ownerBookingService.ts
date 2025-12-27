import { privateClient } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type {
    BookingRequest,
    BookingResponse,
    PlayerBookingResponse,
    OwnerBookingResponse,
} from "../types/booking.type";
import type { ApiResponse } from "@/lib/axios";

export const ownerBookingService = {
    createBooking: async (data: BookingRequest): Promise<BookingResponse> => {
        const response = await privateClient.post<ApiResponse<BookingResponse>>(
            ENDPOINTS.BOOKING.CREATE,
            data
        );
        return response.data.data!;
    },

    getMyBookings: async (): Promise<PlayerBookingResponse[]> => {
        const response = await privateClient.get<ApiResponse<PlayerBookingResponse[]>>(
            ENDPOINTS.BOOKING.MY_BOOKINGS
        );
        return response.data.data || [];
    },

    getOwnerBookings: async (): Promise<OwnerBookingResponse[]> => {
        const response = await privateClient.get<ApiResponse<OwnerBookingResponse[]>>(
            ENDPOINTS.BOOKING.OWNER_BOOKINGS
        );
        return response.data.data || [];
    },

    updateBookingStatus: async (bookingId: string, status: string): Promise<OwnerBookingResponse> => {
        const response = await privateClient.put<ApiResponse<OwnerBookingResponse>>(
            ENDPOINTS.BOOKING.UPDATE_STATUS(bookingId),
            { status }
        );
        return response.data.data!;
    },
};



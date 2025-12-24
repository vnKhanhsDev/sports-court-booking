import { publicClient } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { ApiResponse } from "@/lib/axios";

export interface InitPaymentRequest {
    bookingId?: string;
    amount: number;
    orderInfo?: string;
    orderType?: string;
}

export interface InitPaymentResponse {
    vnpUrl: string;
    txnRef: string;
}

export const paymentService = {
    initVNPayPayment: async (request: InitPaymentRequest): Promise<InitPaymentResponse> => {
        console.log("Payment service - Sending request:", request);
        
        try {
            const response = await publicClient.post<ApiResponse<InitPaymentResponse>>(
                ENDPOINTS.PAYMENT.VNPAY.INIT,
                request
            );
            
            console.log("Payment service - Full response:", response);
            console.log("Payment service - Response data:", response.data);
            
            // Check if the response indicates an error
            if (!response.data.success || !response.data.data) {
                const errorMessage = response.data.message || "Không thể khởi tạo thanh toán VNPay. Vui lòng thử lại.";
                console.error("Payment service - Error response:", response.data);
                throw new Error(errorMessage);
            }
            
            console.log("Payment service - Success, returning:", response.data.data);
            return response.data.data;
        } catch (error: any) {
            console.error("Payment service - Exception caught:", error);
            console.error("Payment service - Error response:", error.response?.data);
            throw error;
        }
    },
};


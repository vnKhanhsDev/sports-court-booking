import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BookingCheckoutPage.module.css";
import type { BookingRequest } from "@/features/booking/types/booking.types";
import BookingCheckoutBooker, {
  type BookingCheckoutBookerData,
} from "../components/BookingCheckoutBooker";
import BookingCheckoutPayment, {
  type BookingPaymentMethod,
} from "../components/BookingCheckoutPayment";
import { bookingService } from "@/features/booking/services/bookingService";
import { paymentService } from "@/features/payment/services/paymentService";
import useApi from "@/hooks/useApi";
import { ROUTES } from "@/constants/route";
import { useAuth } from "@/contexts/AuthContext";

type CheckoutState = Partial<
  Pick<
    BookingRequest,
    | "courtId"
    | "facilityId"
    | "startTime"
    | "endTime"
    | "bookingDate"
  >
> & {
  facilityName?: string;
  courtName?: string;
  totalPrice?: number;
};

const formatTime = (time?: string) => (time ? time.substring(0, 5) : "--:--");

const formatDate = (dateString?: string) => {
  if (!dateString) return "--/--/----";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function BookingCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { execute, isLoading } = useApi();
  const { user } = useAuth();
  const state = (location.state || {}) as CheckoutState;

  const {
    facilityName,
    courtName,
    bookingDate,
    startTime,
    endTime,
    totalPrice,
  } = state;

  const [bookerInfo, setBookerInfo] = useState<BookingCheckoutBookerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<BookingPaymentMethod>("cash");

  const hasState = Boolean(state && state.courtId && bookingDate && startTime && endTime);
  
  // Check if user is logged in and has player role
  const isGuest = !user || !user.roles.includes("PLAYER");
  
  // For guest bookings, require full payment (no deposit option)
  const depositAmount = isGuest ? totalPrice : (totalPrice ? totalPrice * 0.3 : 0);
  const finalAmount = isGuest ? totalPrice : depositAmount;

  const handleBack = () => navigate(-1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasState) {
      alert("Chưa có thông tin đặt sân. Vui lòng quay lại và chọn thời gian.");
      return;
    }

    if (!bookerInfo) {
      alert("Vui lòng nhập thông tin người đặt.");
      return;
    }

    if (!bookerInfo.customerName.trim()) {
      alert("Vui lòng nhập họ và tên.");
      return;
    }

    if (!bookerInfo.customerPhone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!bookerInfo.customerEmail.trim()) {
      alert("Vui lòng nhập địa chỉ email.");
      return;
    }

    if (!state.courtId || !state.facilityId) {
      alert("Thiếu thông tin sân hoặc cơ sở. Vui lòng thử lại.");
      return;
    }

    // For logged-in users with PLAYER role, playerId = accountId (due to @MapsId in PlayerInfo)
    // For guest bookings, playerId is undefined
    const bookingRequest: BookingRequest = {
      playerId: user && user.roles.includes("PLAYER") ? user.accountId : undefined,
      courtId: state.courtId!,
      facilityId: state.facilityId!,
      startTime: startTime!,
      endTime: endTime!,
      bookingDate: bookingDate!,
      customerName: bookerInfo.customerName.trim(),
      customerPhone: bookerInfo.customerPhone.trim(),
      customerEmail: bookerInfo.customerEmail.trim(),
      note: bookerInfo.notes.trim() || undefined,
      paymentMethod,
    };

    console.log("Creating booking with request:", bookingRequest);

    try {
      // Step 1: Create booking first
      const bookingResult = await execute(async () => {
        return await bookingService.createBooking(bookingRequest);
      });

      console.log("Booking creation result:", bookingResult);

      // Check if the result is an error response
      if (bookingResult && 'success' in bookingResult && !bookingResult.success) {
        const errorMessage = bookingResult.message || "Đặt sân thất bại. Vui lòng thử lại.";
        console.error("Booking creation error:", bookingResult);
        alert(errorMessage);
        return;
      }

      if (!bookingResult || !bookingResult.id) {
        console.error("Invalid booking result:", bookingResult);
        alert("Đặt sân thất bại. Vui lòng thử lại.");
        return;
      }

      // Step 2: Handle payment based on payment method
      if (paymentMethod === "vnpay") {
        // Validate amount before initiating payment
        if (!finalAmount || finalAmount <= 0) {
          alert("Số tiền thanh toán không hợp lệ. Vui lòng thử lại.");
          return;
        }

        // Initiate VNPay payment
        console.log("Initiating VNPay payment with:", {
          bookingId: bookingResult.id,
          amount: finalAmount,
          orderInfo: `Thanh toan dat san - ${facilityName} - ${courtName}`,
        });

        try {
          const paymentResult = await execute(async () => {
            return await paymentService.initVNPayPayment({
              bookingId: bookingResult.id,
              amount: finalAmount,
              orderInfo: `Thanh toan dat san - ${facilityName} - ${courtName}`,
            });
          });

          console.log("VNPay payment initiation result:", paymentResult);
          console.log("Payment result type:", typeof paymentResult);
          
          // Handle error response from useApi hook (when payment service throws)
          if (paymentResult && typeof paymentResult === 'object' && 'success' in paymentResult) {
            if (!paymentResult.success) {
              const errorMessage = (paymentResult as any).message || "Không thể khởi tạo thanh toán VNPay. Vui lòng thử lại.";
              console.error("VNPay payment initiation error response:", paymentResult);
              alert(errorMessage);
              return;
            }
            // If success is true, check if data exists (wrapped in ApiResponse)
            if ((paymentResult as any).data) {
              const paymentData = (paymentResult as any).data;
              if (paymentData && paymentData.vnpUrl) {
                console.log("Redirecting to VNPay URL (from data):", paymentData.vnpUrl);
                window.location.href = paymentData.vnpUrl;
                return;
              }
            }
          }

          // Check if the result directly has vnpUrl (successful response from payment service)
          if (paymentResult && typeof paymentResult === 'object' && 'vnpUrl' in paymentResult && (paymentResult as any).vnpUrl) {
            console.log("Redirecting to VNPay URL (direct):", (paymentResult as any).vnpUrl);
            window.location.href = (paymentResult as any).vnpUrl;
            return;
          }

          // If we get here, something went wrong
          console.error("VNPay payment result is invalid or missing vnpUrl:", paymentResult);
          if (paymentResult && typeof paymentResult === 'object') {
            console.error("Payment result keys:", Object.keys(paymentResult));
            console.error("Payment result JSON:", JSON.stringify(paymentResult, null, 2));
          }
          alert("Không thể khởi tạo thanh toán VNPay. Vui lòng thử lại.");
        } catch (paymentError) {
          console.error("VNPay payment initiation exception:", paymentError);
          const errorMessage = paymentError instanceof Error ? paymentError.message : "Đã xảy ra lỗi khi khởi tạo thanh toán. Đơn đặt sân đã được tạo với trạng thái chờ thanh toán.";
          alert(errorMessage);
        }
      } else if (paymentMethod === "cash") {
        // For cash payment, booking is created with PENDING status
        // Owner will confirm later
        alert("Đặt sân thành công! Vui lòng thanh toán tại sân. Bạn sẽ được chuyển đến danh sách đặt sân.");
        navigate(ROUTES.PLAYER.BOOKING.MY_BOOKINGS, { replace: true });
      } else {
        // Other payment methods (banking, momo) - handle similarly to cash for now
        alert("Đặt sân thành công! Bạn sẽ được chuyển đến danh sách đặt sân.");
        navigate(ROUTES.PLAYER.BOOKING.MY_BOOKINGS, { replace: true });
      }
    } catch (error) {
      console.error("Booking checkout error:", error);
      
      // Check if it's an error response from the API
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message || "Đã xảy ra lỗi khi đặt sân. Vui lòng thử lại sau.";
        alert(errorMessage);
      } else {
        alert("Đã xảy ra lỗi khi đặt sân. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Xác nhận đặt sân</h1>
          <p className={styles.subtitle}>Kiểm tra thông tin và hoàn tất thanh toán</p>
        </div>
        <button className={styles.backButton} onClick={handleBack}>
          ← Quay lại
        </button>
      </div>

      {!hasState && (
        <div className={styles.empty}>
          <p>Chưa có thông tin đặt sân. Vui lòng quay lại và chọn thời gian.</p>
          <button className={styles.primaryButton} onClick={handleBack}>
            Chọn lại thời gian
          </button>
        </div>
      )}

      {hasState && (
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Thông tin đặt sân</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Cơ sở</span>
                <span className={styles.value}>{facilityName || "—"}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Sân</span>
                <span className={styles.value}>{courtName || "—"}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Ngày đặt</span>
                <span className={styles.value}>{formatDate(bookingDate)}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Khung giờ</span>
                <span className={styles.value}>
                  {formatTime(startTime)} - {formatTime(endTime)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>
                  {isGuest ? "Tổng tiền (Thanh toán đầy đủ)" : "Tiền cọc (30%)"}
                </span>
                <span className={styles.valueHighlight}>
                  {finalAmount !== undefined
                    ? `${Number(finalAmount).toLocaleString("vi-VN")}₫`
                    : "—"}
                </span>
              </div>
              {!isGuest && totalPrice && (
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Tổng tiền</span>
                  <span className={styles.value}>
                    {`${Number(totalPrice).toLocaleString("vi-VN")}₫`}
                  </span>
                </div>
              )}
            </div>
          </section>

          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section}>
              <BookingCheckoutBooker
                initialName=""
                initialPhone=""
                initialEmail=""
                onChange={setBookerInfo}
              />
            </section>

            <section className={styles.section}>
              <BookingCheckoutPayment onPaymentChange={setPaymentMethod} />
            </section>

            <div className={styles.actions}>
              <button type="button" className={styles.secondaryButton} onClick={handleBack}>
                Quay lại
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={!hasState || isLoading}
              >
                Xác nhận & Thanh toán
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/route";
import styles from "./VNPayReturnPage.module.css";

export default function VNPayReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    // Get response code from VNPay callback (direct from VNPay) or from backend redirect
    const responseCode = searchParams.get("vnp_ResponseCode");
    const successParam = searchParams.get("success");
    const txnRef = searchParams.get("vnp_TxnRef");
    const transactionNo = searchParams.get("vnp_TransactionNo");

    // Check if backend redirected with success parameter, or check VNPay response code
    const isSuccess = successParam === "true" || responseCode === "00";

    if (isSuccess) {
      setStatus("success");
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.PLAYER.BOOKING.MY_BOOKINGS, { replace: true });
      }, 3000);
    } else {
      setStatus("failed");
    }
  }, [searchParams, navigate]);

  const handleGoToBookings = () => {
    navigate(ROUTES.PLAYER.BOOKING.MY_BOOKINGS, { replace: true });
  };

  const handleGoHome = () => {
    navigate(ROUTES.PUBLIC.MARKETPLACE.HOME, { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {status === "loading" && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang xử lý kết quả thanh toán...</p>
          </div>
        )}

        {status === "success" && (
          <div className={styles.success}>
            <div className={styles.icon}>✓</div>
            <h1 className={styles.title}>Thanh toán thành công!</h1>
            <p className={styles.message}>
              Đơn đặt sân của bạn đã được xác nhận. Bạn sẽ được chuyển đến danh sách đặt sân trong giây lát.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={handleGoToBookings}>
                Xem đơn đặt sân
              </button>
              <button className={styles.secondaryButton} onClick={handleGoHome}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className={styles.failed}>
            <div className={styles.icon}>✕</div>
            <h1 className={styles.title}>Thanh toán thất bại</h1>
            <p className={styles.message}>
              Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={handleGoToBookings}>
                Xem đơn đặt sân
              </button>
              <button className={styles.secondaryButton} onClick={handleGoHome}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


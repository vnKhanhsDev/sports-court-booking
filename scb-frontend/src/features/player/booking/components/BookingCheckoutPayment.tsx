import { useState, useEffect } from "react";
import styles from "./BookingCheckoutPayment.module.css";

export type BookingPaymentMethod = "banking" | "momo" | "vnpay" | "cash";

interface BookingCheckoutPaymentProps {
  onPaymentChange?: (method: BookingPaymentMethod) => void;
}

export default function BookingCheckoutPayment({ onPaymentChange }: BookingCheckoutPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<BookingPaymentMethod>("cash");

  useEffect(() => {
    if (onPaymentChange) {
      onPaymentChange(paymentMethod);
    }
  }, [paymentMethod, onPaymentChange]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Phương thức thanh toán</h3>
        <p className={styles.subtitle}>Chọn phương thức thanh toán phù hợp với bạn</p>
      </div>

      <div className={styles.paymentMethods}>
        <button
          type="button"
          className={`${styles.paymentMethod} ${
            paymentMethod === "banking" ? styles.active : ""
          }`}
          onClick={() => setPaymentMethod("banking")}
        >
          <div className={styles.paymentIcon}>🏦</div>
          <div className={styles.paymentInfo}>
            <span className={styles.paymentName}>Chuyển khoản ngân hàng</span>
            <span className={styles.paymentDescription}>
              Thanh toán qua chuyển khoản ngân hàng
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.paymentMethod} ${
            paymentMethod === "momo" ? styles.active : ""
          }`}
          onClick={() => setPaymentMethod("momo")}
        >
          <div className={styles.paymentIcon}>💳</div>
          <div className={styles.paymentInfo}>
            <span className={styles.paymentName}>Ví MoMo</span>
            <span className={styles.paymentDescription}>
              Thanh toán nhanh qua ví điện tử MoMo
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.paymentMethod} ${
            paymentMethod === "vnpay" ? styles.active : ""
          }`}
          onClick={() => setPaymentMethod("vnpay")}
        >
          <div className={styles.paymentIcon}>💳</div>
          <div className={styles.paymentInfo}>
            <span className={styles.paymentName}>VNPay</span>
            <span className={styles.paymentDescription}>
              Thanh toán qua cổng VNPay
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.paymentMethod} ${
            paymentMethod === "cash" ? styles.active : ""
          }`}
          onClick={() => setPaymentMethod("cash")}
        >
          <div className={styles.paymentIcon}>💵</div>
          <div className={styles.paymentInfo}>
            <span className={styles.paymentName}>Thanh toán tại sân</span>
            <span className={styles.paymentDescription}>
              Thanh toán bằng tiền mặt khi đến sân
            </span>
          </div>
        </button>
      </div>

      <div className={styles.paymentNote}>
        <div className={styles.noteIcon}>ℹ️</div>
        <div className={styles.noteContent}>
          <p className={styles.noteTitle}>Lưu ý thanh toán</p>
          <ul className={styles.noteList}>
            <li>Đơn đặt sân sẽ được xác nhận sau khi thanh toán thành công</li>
            <li>Vui lòng thanh toán trong vòng 15 phút để giữ chỗ</li>
            <li>Nếu chọn thanh toán tại sân, vui lòng đến đúng giờ đã đặt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



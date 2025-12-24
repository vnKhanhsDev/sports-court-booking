import { useState, useEffect } from "react";
import styles from "./BookingCheckoutBooker.module.css";

export interface BookingCheckoutBookerData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}

interface BookingCheckoutBookerProps {
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
  onChange?: (data: BookingCheckoutBookerData) => void;
}

export default function BookingCheckoutBooker({
  initialName = "",
  initialPhone = "",
  initialEmail = "",
  onChange,
}: BookingCheckoutBookerProps) {
  const [customerName, setCustomerName] = useState(initialName);
  const [customerPhone, setCustomerPhone] = useState(initialPhone);
  const [customerEmail, setCustomerEmail] = useState(initialEmail);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (onChange) {
      onChange({
        customerName,
        customerPhone,
        customerEmail,
        notes,
      });
    }
  }, [customerName, customerPhone, customerEmail, notes, onChange]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin người đặt</h2>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Họ và tên</span>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="Nguyễn Văn A"
          />
        </label>
        <label className={styles.field}>
          <span>Số điện thoại</span>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            placeholder="09xx xxx xxx"
          />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </label>
        <label className={`${styles.field} ${styles.fullWidth}`}>
          <span>Ghi chú</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Yêu cầu thêm (nếu có)"
          />
        </label>
      </div>
    </div>
  );
}



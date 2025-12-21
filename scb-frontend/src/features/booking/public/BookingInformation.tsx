import { useState, useEffect } from "react";
import styles from "./BookingInformation.module.css";

export interface BookingInformationData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
    agreedToTerms: boolean;
}

interface BookingInformationProps {
    hours: number;
    pricePerHour: number;
    totalPrice: number;
    onDataChange?: (data: BookingInformationData) => void;
}

export default function BookingInformation({ hours, pricePerHour, totalPrice, onDataChange }: BookingInformationProps) {
    const [customerName, setCustomerName] = useState<string>("");
    const [customerPhone, setCustomerPhone] = useState<string>("");
    const [customerEmail, setCustomerEmail] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

    useEffect(() => {
        if (onDataChange) {
            onDataChange({
                customerName,
                customerPhone,
                customerEmail,
                notes,
                agreedToTerms
            });
        }
    }, [customerName, customerPhone, customerEmail, notes, agreedToTerms, onDataChange]);
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Thông tin đặt sân</h3>
                <p className={styles.subtitle}>Vui lòng điền đầy đủ thông tin để hoàn tất đặt sân</p>
            </div>

            <div className={styles.form}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Họ và tên <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Nhập họ và tên của bạn"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Số điện thoại <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="tel"
                            className={styles.input}
                            placeholder="Nhập số điện thoại"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Email <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="email"
                        className={styles.input}
                        placeholder="Nhập địa chỉ email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Ghi chú (tùy chọn)
                    </label>
                    <textarea
                        className={styles.textarea}
                        rows={4}
                        placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input 
                            type="checkbox" 
                            className={styles.checkbox}
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <span className={styles.checkboxText}>
                            Tôi đồng ý với <a href="#" className={styles.link}>Điều khoản và Điều kiện</a> đặt sân
                        </span>
                    </label>
                </div>

                <div className={styles.summary}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Số lượng giờ:</span>
                        <span className={styles.summaryValue}>{hours || 0} giờ</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Giá mỗi giờ:</span>
                        <span className={styles.summaryValue}>{pricePerHour.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className={styles.summaryDivider}></div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Tổng cộng:</span>
                        <span className={styles.summaryTotal}>{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

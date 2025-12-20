import { useState, useEffect } from "react";
import styles from "./PaymentOptions.module.css";

export type PaymentMethod = "banking" | "momo" | "vnpay" | "cash";

interface PaymentOptionsProps {
    onPaymentChange?: (method: PaymentMethod) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
}

export default function PaymentOptions({ onPaymentChange, onSubmit, onCancel }: PaymentOptionsProps) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash"); // Default to cash

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
                <div className={styles.paymentMethod}>
                    <label className={styles.paymentLabel}>
                        <input
                            type="radio"
                            name="payment"
                            value="banking"
                            className={styles.radio}
                            defaultChecked
                        />
                        <div className={styles.paymentContent}>
                            <div className={styles.paymentIcon}>🏦</div>
                            <div className={styles.paymentInfo}>
                                <span className={styles.paymentName}>Chuyển khoản ngân hàng</span>
                                <span className={styles.paymentDescription}>
                                    Thanh toán qua chuyển khoản ngân hàng
                                </span>
                            </div>
                        </div>
                        <div className={styles.radioIndicator}></div>
                    </label>
                </div>

                <div className={styles.paymentMethod}>
                    <label className={styles.paymentLabel}>
                        <input
                            type="radio"
                            name="payment"
                            value="momo"
                            className={styles.radio}
                            checked={paymentMethod === "momo"}
                            onChange={() => setPaymentMethod("momo")}
                        />
                        <div className={styles.paymentContent}>
                            <div className={styles.paymentIcon}>💳</div>
                            <div className={styles.paymentInfo}>
                                <span className={styles.paymentName}>Ví MoMo</span>
                                <span className={styles.paymentDescription}>
                                    Thanh toán nhanh qua ví điện tử MoMo
                                </span>
                            </div>
                        </div>
                        <div className={styles.radioIndicator}></div>
                    </label>
                </div>

                <div className={styles.paymentMethod}>
                    <label className={styles.paymentLabel}>
                        <input
                            type="radio"
                            name="payment"
                            value="vnpay"
                            className={styles.radio}
                            checked={paymentMethod === "vnpay"}
                            onChange={() => setPaymentMethod("vnpay")}
                        />
                        <div className={styles.paymentContent}>
                            <div className={styles.paymentIcon}>💳</div>
                            <div className={styles.paymentInfo}>
                                <span className={styles.paymentName}>VNPay</span>
                                <span className={styles.paymentDescription}>
                                    Thanh toán qua cổng VNPay
                                </span>
                            </div>
                        </div>
                        <div className={styles.radioIndicator}></div>
                    </label>
                </div>

                <div className={styles.paymentMethod}>
                    <label className={styles.paymentLabel}>
                        <input
                            type="radio"
                            name="payment"
                            value="cash"
                            className={styles.radio}
                            checked={paymentMethod === "cash"}
                            onChange={() => setPaymentMethod("cash")}
                        />
                        <div className={styles.paymentContent}>
                            <div className={styles.paymentIcon}>💵</div>
                            <div className={styles.paymentInfo}>
                                <span className={styles.paymentName}>Thanh toán tại sân</span>
                                <span className={styles.paymentDescription}>
                                    Thanh toán bằng tiền mặt khi đến sân
                                </span>
                            </div>
                        </div>
                        <div className={styles.radioIndicator}></div>
                    </label>
                </div>
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

            <div className={styles.actionButtons}>
                <button 
                    type="button"
                    className={styles.cancelButton}
                    onClick={onCancel || (() => window.history.back())}
                >
                    Hủy đặt sân
                </button>
                <button 
                    type="button"
                    className={styles.submitButton}
                    onClick={onSubmit}
                >
                    Xác nhận và thanh toán
                </button>
            </div>
        </div>
    );
}

import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLES } from "@/constants/role";
import { ROUTES } from "@/constants/route";
import useCourtDetail from "@/features/court/public/detail/useCourtDetail";
import { bookingService } from "../services/bookingService";
import useApi from "@/hooks/useApi";
import { LeftArrow } from "@/components/ui/icons";
import TimeSelection from "./TimeSelection";
import type { TimeSelectionData } from "./TimeSelection";
import BookingInformation from "./BookingInformation";
import type { BookingInformationData } from "./BookingInformation";
import PaymentOptions from "./PaymentOptions";
import type { PaymentMethod } from "./PaymentOptions";
import styles from "./CourtBookingPage.module.css";

export default function CourtBookingPage() {
    const navigate = useNavigate();
    const { user, activeRole, isLoading: authLoading } = useAuth();
    const { courtDetail, isLoading: courtLoading, error } = useCourtDetail();
    const { execute } = useApi();

    // Booking form state
    const [timeSelectionData, setTimeSelectionData] = useState<TimeSelectionData | null>(null);
    const [bookingInfoData, setBookingInfoData] = useState<BookingInformationData | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

    // Check authentication and role
    const isAuthenticated = !!user && !!activeRole;
    const isPlayer = useMemo(() => {
        if (!user) return false;
        return user.roles.some(role => role.toLowerCase() === USER_ROLES.PLAYER.toLowerCase());
    }, [user]);

    // Show warning and redirect if not authenticated or not player
    const checkAuthAndRole = useCallback(() => {
        if (authLoading) return false; // Wait for auth to load

        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để đặt sân. Bạn sẽ được chuyển đến trang đăng nhập.");
            navigate(ROUTES.AUTH.getLogin(USER_ROLES.PLAYER), { replace: true });
            return false;
        }

        if (!isPlayer) {
            alert("Bạn cần có tài khoản người chơi để đặt sân. Vui lòng đăng nhập với tài khoản người chơi.");
            navigate(ROUTES.AUTH.getLogin(USER_ROLES.PLAYER), { replace: true });
            return false;
        }

        return true;
    }, [authLoading, isAuthenticated, isPlayer, navigate]);

    // Validate booking data
    const validateBookingData = useCallback((): boolean => {
        if (!timeSelectionData) {
            alert("Vui lòng chọn thời gian đặt sân.");
            return false;
        }

        if (!timeSelectionData.selectedStartTime || !timeSelectionData.selectedEndTime) {
            alert("Vui lòng chọn đầy đủ giờ bắt đầu và giờ kết thúc.");
            return false;
        }

        if (timeSelectionData.scheduleType === "oddDays" && !timeSelectionData.selectedDate) {
            alert("Vui lòng chọn ngày đặt sân.");
            return false;
        }

        if (timeSelectionData.scheduleType === "fixedDays" && timeSelectionData.selectedDaysOfWeek.length === 0) {
            alert("Vui lòng chọn ít nhất một thứ trong tuần.");
            return false;
        }

        if (!bookingInfoData) {
            alert("Vui lòng điền đầy đủ thông tin đặt sân.");
            return false;
        }

        if (!bookingInfoData.customerName.trim()) {
            alert("Vui lòng nhập họ và tên.");
            return false;
        }

        if (!bookingInfoData.customerPhone.trim()) {
            alert("Vui lòng nhập số điện thoại.");
            return false;
        }

        if (!bookingInfoData.customerEmail.trim()) {
            alert("Vui lòng nhập địa chỉ email.");
            return false;
        }

        if (!bookingInfoData.agreedToTerms) {
            alert("Vui lòng đồng ý với Điều khoản và Điều kiện đặt sân.");
            return false;
        }

        return true;
    }, [timeSelectionData, bookingInfoData]);

    // Handle booking submission
    const handleSubmitBooking = useCallback(async () => {
        // Check auth and role first
        if (!checkAuthAndRole()) {
            return;
        }

        // Validate data
        if (!validateBookingData() || !courtDetail || !timeSelectionData || !bookingInfoData) {
            return;
        }

        // Prepare booking request
        const bookingDate = timeSelectionData.scheduleType === "oddDays" && timeSelectionData.selectedDate
            ? timeSelectionData.selectedDate.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]; // Fallback to today

        const startTime = `${timeSelectionData.selectedStartTime}:00`;
        const endTime = `${timeSelectionData.selectedEndTime}:00`;

        const bookingRequest = {
            courtId: courtDetail.id,
            facilityId: courtDetail.facilityId,
            startTime,
            endTime,
            bookingDate,
            daysOfWeek: timeSelectionData.scheduleType === "fixedDays" ? timeSelectionData.selectedDaysOfWeek : undefined,
            scheduleType: timeSelectionData.scheduleType,
            customerName: bookingInfoData.customerName.trim(),
            customerPhone: bookingInfoData.customerPhone.trim(),
            customerEmail: bookingInfoData.customerEmail.trim(),
            notes: bookingInfoData.notes.trim() || undefined,
            totalPrice: timeSelectionData.totalPrice,
            paymentMethod
        };

        // Submit booking
        try {
            const result = await execute(async () => {
                return await bookingService.createBooking(bookingRequest);
            });

            if (result && result.id) {
                alert("Đặt sân thành công! Bạn sẽ được chuyển về trang chi tiết sân.");
                navigate(`/courts/${courtDetail.id}`, { replace: true });
            } else {
                alert("Đặt sân thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Đã xảy ra lỗi khi đặt sân. Vui lòng thử lại.");
        }
    }, [checkAuthAndRole, validateBookingData, courtDetail, timeSelectionData, bookingInfoData, paymentMethod, execute, navigate]);


    // Check auth on mount
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            alert("Vui lòng đăng nhập để đặt sân. Bạn sẽ được chuyển đến trang đăng nhập.");
            navigate(ROUTES.AUTH.getLogin(USER_ROLES.PLAYER), { replace: true });
        } else if (!authLoading && isAuthenticated && !isPlayer) {
            alert("Bạn cần có tài khoản người chơi để đặt sân. Vui lòng đăng nhập với tài khoản người chơi.");
            navigate(ROUTES.AUTH.getLogin(USER_ROLES.PLAYER), { replace: true });
        }
    }, [authLoading, isAuthenticated, isPlayer, navigate]);

    // Calculate hours and price per hour
    const hours = useMemo(() => {
        if (!timeSelectionData?.selectedStartTime || !timeSelectionData?.selectedEndTime) return 0;
        const startHour = parseInt(timeSelectionData.selectedStartTime.split(':')[0]);
        const endHour = parseInt(timeSelectionData.selectedEndTime.split(':')[0]);
        return Math.max(1, endHour - startHour);
    }, [timeSelectionData]);

    const pricePerHour = useMemo(() => {
        if (!timeSelectionData?.selectedStartTime || hours === 0) return 0;
        return timeSelectionData.totalPrice / hours;
    }, [timeSelectionData, hours]);

    if (courtLoading || authLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <p>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error || !courtDetail) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>{error || "Không tìm thấy thông tin sân"}</p>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Back Button */}
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                <LeftArrow />
                <span>Quay lại</span>
            </button>

            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Đặt sân</h1>
                <div className={styles.courtInfo}>
                    <h2 className={styles.courtName}>{courtDetail.name}</h2>
                    <p className={styles.facilityName}>{courtDetail.facilityName}</p>
                    <p className={styles.address}>{courtDetail.facilityAddress}</p>
                </div>
            </div>

            {/* Booking Steps */}
            <div className={styles.steps}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <TimeSelection 
                            openingTime={courtDetail.facilityOpeningTime}
                            closingTime={courtDetail.facilityClosingTime}
                            onDataChange={setTimeSelectionData}
                        />
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <BookingInformation
                            hours={hours}
                            pricePerHour={pricePerHour}
                            totalPrice={timeSelectionData?.totalPrice || 0}
                            onDataChange={setBookingInfoData}
                        />
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <PaymentOptions 
                            onPaymentChange={setPaymentMethod}
                            onSubmit={handleSubmitBooking}
                            onCancel={() => navigate(-1)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

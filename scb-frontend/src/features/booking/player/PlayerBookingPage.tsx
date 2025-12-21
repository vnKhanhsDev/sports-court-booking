import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLES } from "@/constants/role";
import { ROUTES } from "@/constants/route";
import { bookingService } from "../services/bookingService";
import useApi from "@/hooks/useApi";
import type { PlayerBookingResponse, BookingStatus } from "../types/booking.types";
import styles from "./PlayerBookingPage.module.css";

type FilterStatus = "all" | BookingStatus;

export default function PlayerBookingPage() {
    const { user, activeRole } = useAuth();
    const { execute, isLoading } = useApi();
    const [bookings, setBookings] = useState<PlayerBookingResponse[]>([]);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Check if user is authenticated and has player role
    const isPlayer = useMemo(() => {
        if (!user) return false;
        return user.roles.some(role => role.toLowerCase() === USER_ROLES.PLAYER.toLowerCase());
    }, [user]);

    // Fetch bookings
    useEffect(() => {
        if (isPlayer && activeRole === USER_ROLES.PLAYER) {
            execute(async () => {
                const result = await bookingService.getMyBookings();
                setBookings(result);
                return result;
            });
        }
    }, [isPlayer, activeRole, execute]);

    // Filter bookings
    const filteredBookings = useMemo(() => {
        let filtered = bookings;

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter(booking => booking.status === filterStatus);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(booking =>
                booking.courtName.toLowerCase().includes(query) ||
                booking.facilityName.toLowerCase().includes(query) ||
                booking.facilityAddress.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [bookings, filterStatus, searchQuery]);

    // Group bookings by status
    const bookingsByStatus = useMemo(() => {
        const groups: Record<string, PlayerBookingResponse[]> = {
            pending: [],
            confirmed: [],
            completed: [],
            cancelled: [],
            other: []
        };

        filteredBookings.forEach(booking => {
            const status = booking.status.toLowerCase();
            if (status === "pending") {
                groups.pending.push(booking);
            } else if (status === "confirmed") {
                groups.confirmed.push(booking);
            } else if (status === "completed") {
                groups.completed.push(booking);
            } else if (status === "cancelled") {
                groups.cancelled.push(booking);
            } else {
                groups.other.push(booking);
            }
        });

        return groups;
    }, [filteredBookings]);

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            CANCELLED: "Đã hủy",
            COMPLETED: "Hoàn thành",
            NO_SHOW: "Không đến",
            EXPIRED: "Hết hạn"
        };
        return labels[status] || status;
    };

    const getStatusClass = (status: string): string => {
        const classes: Record<string, string> = {
            PENDING: styles.statusPending,
            CONFIRMED: styles.statusConfirmed,
            CANCELLED: styles.statusCancelled,
            COMPLETED: styles.statusCompleted,
            NO_SHOW: styles.statusNoShow,
            EXPIRED: styles.statusExpired
        };
        return classes[status] || styles.statusDefault;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string): string => {
        return timeString.substring(0, 5); // "HH:mm"
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    if (!isPlayer || activeRole !== USER_ROLES.PLAYER) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>Bạn cần đăng nhập với tài khoản người chơi để xem đơn đặt sân.</p>
                    <Link to={ROUTES.AUTH.getLogin(USER_ROLES.PLAYER)} className={styles.loginButton}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Đơn đặt sân của tôi</h1>
                    <p className={styles.subtitle}>Quản lý và theo dõi các đơn đặt sân của bạn</p>
                </div>
                <Link to={ROUTES.PUBLIC.COURTS.SEARCH} className={styles.newBookingButton}>
                    <span>+</span>
                    <span>Đặt sân mới</span>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sân, cơ sở hoặc địa chỉ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.statusFilters}>
                    <button
                        className={`${styles.filterButton} ${filterStatus === "all" ? styles.filterButtonActive : ""}`}
                        onClick={() => setFilterStatus("all")}
                    >
                        Tất cả ({bookings.length})
                    </button>
                    <button
                        className={`${styles.filterButton} ${filterStatus === "PENDING" ? styles.filterButtonActive : ""}`}
                        onClick={() => setFilterStatus("PENDING")}
                    >
                        Chờ xác nhận ({bookingsByStatus.pending.length})
                    </button>
                    <button
                        className={`${styles.filterButton} ${filterStatus === "CONFIRMED" ? styles.filterButtonActive : ""}`}
                        onClick={() => setFilterStatus("CONFIRMED")}
                    >
                        Đã xác nhận ({bookingsByStatus.confirmed.length})
                    </button>
                    <button
                        className={`${styles.filterButton} ${filterStatus === "COMPLETED" ? styles.filterButtonActive : ""}`}
                        onClick={() => setFilterStatus("COMPLETED")}
                    >
                        Hoàn thành ({bookingsByStatus.completed.length})
                    </button>
                    <button
                        className={`${styles.filterButton} ${filterStatus === "CANCELLED" ? styles.filterButtonActive : ""}`}
                        onClick={() => setFilterStatus("CANCELLED")}
                    >
                        Đã hủy ({bookingsByStatus.cancelled.length})
                    </button>
                </div>
            </div>

            {/* Bookings List */}
            {isLoading ? (
                <div className={styles.loading}>
                    <p>Đang tải đơn đặt sân...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3>Chưa có đơn đặt sân</h3>
                    <p>
                        {searchQuery || filterStatus !== "all"
                            ? "Không tìm thấy đơn đặt sân phù hợp với bộ lọc của bạn."
                            : "Bạn chưa có đơn đặt sân nào. Hãy bắt đầu đặt sân ngay!"}
                    </p>
                    {!searchQuery && filterStatus === "all" && (
                        <Link to={ROUTES.PUBLIC.COURTS.SEARCH} className={styles.emptyButton}>
                            Tìm sân ngay
                        </Link>
                    )}
                </div>
            ) : (
                <div className={styles.bookingsList}>
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className={styles.bookingCard}>
                            <div className={styles.bookingHeader}>
                                <div className={styles.bookingInfo}>
                                    <h3 className={styles.courtName}>{booking.courtName}</h3>
                                    <p className={styles.facilityName}>{booking.facilityName}</p>
                                    <p className={styles.facilityAddress}>{booking.facilityAddress}</p>
                                </div>
                                <div className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                    {getStatusLabel(booking.status)}
                                </div>
                            </div>

                            <div className={styles.bookingDetails}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>📅 Ngày đặt:</span>
                                    <span className={styles.detailValue}>{formatDate(booking.bookingDate)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>⏰ Thời gian:</span>
                                    <span className={styles.detailValue}>
                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>💰 Tổng tiền:</span>
                                    <span className={styles.detailValue}>{formatPrice(booking.totalPrice)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>🕐 Đặt lúc:</span>
                                    <span className={styles.detailValue}>
                                        {new Date(booking.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.bookingActions}>
                                <Link
                                    to={ROUTES.PUBLIC.COURTS.DETAIL.replace(':id', booking.courtId.toString())}
                                    className={styles.actionButton}
                                >
                                    Xem chi tiết sân
                                </Link>
                                {booking.status === "PENDING" && (
                                    <button className={`${styles.actionButton} ${styles.actionButtonDanger}`}>
                                        Hủy đặt sân
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

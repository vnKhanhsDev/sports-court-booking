import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLES } from "@/constants/role";
import { ROUTES } from "@/constants/route";
import { bookingService } from "../services/bookingService";
import useApi from "@/hooks/useApi";
import type { OwnerBookingResponse, BookingStatus } from "../types/booking.types";
import BookingCalendar from "./BookingCalendar";
import BookingTimeline from "./BookingTimeline";
import styles from "./OwnerBookingPage.module.css";

type FilterStatus = "all" | BookingStatus;
type ViewMode = "table" | "card" | "calendar" | "timeline";

export default function OwnerBookingPage() {
    const { user, activeRole } = useAuth();
    const { execute, isLoading } = useApi();
    const [bookings, setBookings] = useState<OwnerBookingResponse[]>([]);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [filterFacility, setFilterFacility] = useState<string>("all");
    const [filterCourt, setFilterCourt] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [selectedBooking, setSelectedBooking] = useState<OwnerBookingResponse | null>(null);

    // Check if user is authenticated and has owner role
    const isOwner = useMemo(() => {
        if (!user) return false;
        return user.roles.some(role => role.toLowerCase() === USER_ROLES.OWNER.toLowerCase());
    }, [user]);

    // Fetch bookings function
    const fetchBookings = useCallback(async () => {
        if (isOwner && activeRole === USER_ROLES.OWNER) {
            const result = await execute(async () => {
                return await bookingService.getOwnerBookings();
            });
            if (result) {
                setBookings(result);
            }
        }
    }, [isOwner, activeRole, execute]);

    // Fetch bookings on mount
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Get unique facilities for filter
    const facilities = useMemo(() => {
        const uniqueFacilities = new Map<number, string>();
        bookings.forEach(booking => {
            if (!uniqueFacilities.has(booking.facilityId)) {
                uniqueFacilities.set(booking.facilityId, booking.facilityName);
            }
        });
        return Array.from(uniqueFacilities.entries()).map(([id, name]) => ({ id, name }));
    }, [bookings]);

    // Get unique courts for filter
    const courts = useMemo(() => {
        const uniqueCourts = new Map<number, { name: string; facilityId: number }>();
        bookings.forEach(booking => {
            if (!uniqueCourts.has(booking.courtId)) {
                uniqueCourts.set(booking.courtId, { name: booking.courtName, facilityId: booking.facilityId });
            }
        });
        return Array.from(uniqueCourts.entries()).map(([id, data]) => ({ id, ...data }));
    }, [bookings]);

    // Filter bookings (excluding status filter for statistics calculation)
    const bookingsForStats = useMemo(() => {
        let filtered = bookings;

        // Filter by facility
        if (filterFacility !== "all") {
            filtered = filtered.filter(booking => booking.facilityId.toString() === filterFacility);
        }

        // Filter by court
        if (filterCourt !== "all") {
            filtered = filtered.filter(booking => booking.courtId.toString() === filterCourt);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(booking =>
                booking.courtName.toLowerCase().includes(query) ||
                booking.facilityName.toLowerCase().includes(query) ||
                booking.playerName.toLowerCase().includes(query) ||
                booking.playerPhone.toLowerCase().includes(query) ||
                booking.playerEmail.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [bookings, filterFacility, filterCourt, searchQuery]);

    // Filter bookings (including status filter)
    const filteredBookings = useMemo(() => {
        let filtered = bookingsForStats;

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter(booking => booking.status === filterStatus);
        }

        return filtered;
    }, [bookingsForStats, filterStatus]);

    // Group bookings by status for total statistics (for dropdown)
    const totalBookingsByStatus = useMemo(() => {
        const groups: Record<string, OwnerBookingResponse[]> = {
            pending: [],
            confirmed: [],
            completed: [],
            cancelled: [],
            other: []
        };

        bookingsForStats.forEach(booking => {
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
    }, [bookingsForStats]);

    // Calculate total statistics (for dropdown options)
    const totalStats = useMemo(() => {
        return {
            total: bookingsForStats.length,
            pending: totalBookingsByStatus.pending.length,
            confirmed: totalBookingsByStatus.confirmed.length,
            completed: totalBookingsByStatus.completed.length,
            cancelled: totalBookingsByStatus.cancelled.length
        };
    }, [bookingsForStats, totalBookingsByStatus]);

    // Group bookings by status for filtered statistics
    const bookingsByStatus = useMemo(() => {
        const groups: Record<string, OwnerBookingResponse[]> = {
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

    // Calculate statistics (for display)
    const stats = useMemo(() => {
        const totalRevenue = filteredBookings
            .filter(b => b.status === "COMPLETED" || b.status === "CONFIRMED")
            .reduce((sum, b) => sum + b.totalPrice, 0);
        
        return {
            total: filteredBookings.length,
            pending: bookingsByStatus.pending.length,
            confirmed: bookingsByStatus.confirmed.length,
            completed: bookingsByStatus.completed.length,
            cancelled: bookingsByStatus.cancelled.length,
            totalRevenue
        };
    }, [filteredBookings, bookingsByStatus]);

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
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string): string => {
        return timeString.substring(0, 5); // "HH:mm"
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle booking status update
    const handleUpdateBookingStatus = useCallback(async (bookingId: string, newStatus: string) => {
        try {
            const updatedBooking = await execute(async () => {
                return await bookingService.updateBookingStatus(bookingId, newStatus);
            });

            if (updatedBooking) {
                // Refresh bookings list
                await fetchBookings();
                
                // Close modal if open
                if (selectedBooking?.id === bookingId) {
                    setSelectedBooking(null);
                }

                // Show success message
                const statusLabels: Record<string, string> = {
                    CONFIRMED: "xác nhận",
                    CANCELLED: "từ chối",
                    COMPLETED: "hoàn thành"
                };
                alert(`Đã ${statusLabels[newStatus] || "cập nhật"} đơn đặt sân thành công!`);
            }
        } catch (error: any) {
            console.error("Error updating booking status:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Đã xảy ra lỗi khi cập nhật đơn đặt sân.";
            alert(errorMessage);
        }
    }, [execute, selectedBooking, fetchBookings]);

    if (!isOwner || activeRole !== USER_ROLES.OWNER) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>Bạn cần đăng nhập với tài khoản chủ sân để xem quản lý đặt sân.</p>
                    <Link to={ROUTES.AUTH.getLogin(USER_ROLES.OWNER)} className={styles.loginButton}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Statistics Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Tổng đơn</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{stats.pending}</div>
                        <div className={styles.statLabel}>Chờ xác nhận</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>✅</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{stats.confirmed}</div>
                        <div className={styles.statLabel}>Đã xác nhận</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{formatPrice(stats.totalRevenue)}</div>
                        <div className={styles.statLabel}>Doanh thu</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sân, cơ sở, tên khách hàng, SĐT, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Lọc theo trạng thái:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                            className={styles.selectInput}
                        >
                            <option value="all">Tất cả ({totalStats.total})</option>
                            <option value="PENDING">Chờ xác nhận ({totalStats.pending})</option>
                            <option value="CONFIRMED">Đã xác nhận ({totalStats.confirmed})</option>
                            <option value="COMPLETED">Hoàn thành ({totalStats.completed})</option>
                            <option value="CANCELLED">Đã hủy ({totalStats.cancelled})</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Lọc theo cơ sở:</label>
                        <div className={styles.facilityPills}>
                            <button
                                className={`${styles.facilityPill} ${filterFacility === "all" ? styles.facilityPillActive : ""}`}
                                onClick={() => {
                                    setFilterFacility("all");
                                    setFilterCourt("all");
                                }}
                            >
                                Tất cả cơ sở
                            </button>
                            {facilities.map(facility => (
                                <button
                                    key={facility.id}
                                    className={`${styles.facilityPill} ${filterFacility === facility.id.toString() ? styles.facilityPillActive : ""}`}
                                    onClick={() => {
                                        setFilterFacility(facility.id.toString());
                                        setFilterCourt("all");
                                    }}
                                >
                                    {facility.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Lọc theo sân:</label>
                        <select
                            value={filterCourt}
                            onChange={(e) => setFilterCourt(e.target.value)}
                            className={styles.selectInput}
                            disabled={filterFacility === "all"}
                        >
                            <option value="all">Tất cả sân</option>
                            {courts
                                .filter(court => filterFacility === "all" || court.facilityId.toString() === filterFacility)
                                .map(court => (
                                    <option key={court.id} value={court.id.toString()}>
                                        {court.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className={styles.viewModeToggle}>
                        <button
                            className={`${styles.viewModeButton} ${viewMode === "timeline" ? styles.viewModeButtonActive : ""}`}
                            onClick={() => setViewMode("timeline")}
                            title="Xem timeline"
                        >
                            📊
                        </button>
                        <button
                            className={`${styles.viewModeButton} ${viewMode === "table" ? styles.viewModeButtonActive : ""}`}
                            onClick={() => setViewMode("table")}
                            title="Xem dạng bảng"
                        >
                            📋
                        </button>
                        <button
                            className={`${styles.viewModeButton} ${viewMode === "card" ? styles.viewModeButtonActive : ""}`}
                            onClick={() => setViewMode("card")}
                            title="Xem dạng thẻ"
                        >
                            🗂️
                        </button>
                        <button
                            className={`${styles.viewModeButton} ${viewMode === "calendar" ? styles.viewModeButtonActive : ""}`}
                            onClick={() => setViewMode("calendar")}
                            title="Xem lịch"
                        >
                            📅
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookings List/Table/Calendar/Timeline */}
            {isLoading ? (
                <div className={styles.loading}>
                    <p>Đang tải dữ liệu đặt sân...</p>
                </div>
            ) : filteredBookings.length === 0 && viewMode !== "timeline" ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3>Chưa có đơn đặt sân</h3>
                    <p>
                        {searchQuery || filterStatus !== "all" || filterFacility !== "all"
                            ? "Không tìm thấy đơn đặt sân phù hợp với bộ lọc của bạn."
                            : "Bạn chưa có đơn đặt sân nào. Các đơn đặt sân sẽ hiển thị ở đây."}
                    </p>
                </div>
            ) : viewMode === "timeline" ? (
                <div className={styles.timelineWrapper}>
                    <BookingTimeline
                        bookings={filteredBookings}
                        courts={courts.filter(court => 
                            filterFacility === "all" || court.facilityId.toString() === filterFacility
                        )}
                        onBookingClick={(booking) => {
                            setSelectedBooking(booking);
                        }}
                        onEmptySlotClick={(courtId, startTime, endTime) => {
                            // Handle empty slot click - could open a booking creation modal
                            console.log("Create booking for court:", courtId, startTime, endTime);
                            // TODO: Implement booking creation modal
                        }}
                    />
                    {selectedBooking && (
                        <div className={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
                            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.modalHeader}>
                                    <h3 className={styles.modalTitle}>Chi tiết đơn đặt sân</h3>
                                    <button
                                        className={styles.modalClose}
                                        onClick={() => setSelectedBooking(null)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div className={styles.modalSection}>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Mã đơn:</span>
                                            <span className={styles.modalValue}>
                                                #{selectedBooking.id.substring(0, 8)}
                                            </span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Sân:</span>
                                            <span className={styles.modalValue}>{selectedBooking.courtName}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Cơ sở:</span>
                                            <span className={styles.modalValue}>{selectedBooking.facilityName}</span>
                                        </div>
                                    </div>
                                    <div className={styles.modalSection}>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Khách hàng:</span>
                                            <span className={styles.modalValue}>{selectedBooking.playerName}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Số điện thoại:</span>
                                            <span className={styles.modalValue}>{selectedBooking.playerPhone}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Email:</span>
                                            <span className={styles.modalValue}>{selectedBooking.playerEmail}</span>
                                        </div>
                                    </div>
                                    <div className={styles.modalSection}>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Ngày đặt:</span>
                                            <span className={styles.modalValue}>{formatDate(selectedBooking.bookingDate)}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Thời gian:</span>
                                            <span className={styles.modalValue}>
                                                {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                                            </span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Tổng tiền:</span>
                                            <span className={styles.modalValue}>{formatPrice(selectedBooking.totalPrice)}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Trạng thái:</span>
                                            <span className={`${styles.statusBadge} ${getStatusClass(selectedBooking.status)}`}>
                                                {getStatusLabel(selectedBooking.status)}
                                            </span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Đặt lúc:</span>
                                            <span className={styles.modalValue}>{formatDateTime(selectedBooking.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    {selectedBooking.status === "PENDING" && (
                                        <>
                                            <button
                                                className={`${styles.actionButton} ${styles.actionButtonSuccess}`}
                                                onClick={() => handleUpdateBookingStatus(selectedBooking.id, "CONFIRMED")}
                                            >
                                                Xác nhận
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                                onClick={() => {
                                                    if (confirm("Bạn có chắc chắn muốn từ chối đơn đặt sân này?")) {
                                                        handleUpdateBookingStatus(selectedBooking.id, "CANCELLED");
                                                    }
                                                }}
                                            >
                                                Từ chối
                                            </button>
                                        </>
                                    )}
                                    {selectedBooking.status === "CONFIRMED" && (
                                        <button
                                            className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                                            onClick={() => handleUpdateBookingStatus(selectedBooking.id, "COMPLETED")}
                                        >
                                            Hoàn thành
                                        </button>
                                    )}
                                    <Link
                                        to={ROUTES.OWNER.COURT}
                                        className={styles.actionButton}
                                    >
                                        Xem chi tiết sân
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : viewMode === "calendar" ? (
                <div className={styles.calendarWrapper}>
                    <BookingCalendar
                        bookings={filteredBookings}
                        onBookingClick={(booking) => {
                            setSelectedBooking(booking);
                        }}
                    />
                    {selectedBooking && (
                        <div className={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
                            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.modalHeader}>
                                    <h3 className={styles.modalTitle}>Chi tiết đơn đặt sân</h3>
                                    <button
                                        className={styles.modalClose}
                                        onClick={() => setSelectedBooking(null)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div className={styles.modalSection}>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Mã đơn:</span>
                                            <span className={styles.modalValue}>
                                                #{selectedBooking.id.substring(0, 8)}
                                            </span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Sân:</span>
                                            <span className={styles.modalValue}>{selectedBooking.courtName}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Cơ sở:</span>
                                            <span className={styles.modalValue}>{selectedBooking.facilityName}</span>
                                        </div>
                                    </div>
                                    <div className={styles.modalSection}>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Khách hàng:</span>
                                            <span className={styles.modalValue}>{selectedBooking.playerName}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Số điện thoại:</span>
                                            <span className={styles.modalValue}>{selectedBooking.playerPhone}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Email:</span>
                                            <span className={styles.modalValue}>{selectedBooking.playerEmail}</span>
                                        </div>
                                    </div>
                                    <div className={styles.modalSection}>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Ngày đặt:</span>
                                            <span className={styles.modalValue}>{formatDate(selectedBooking.bookingDate)}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Thời gian:</span>
                                            <span className={styles.modalValue}>
                                                {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                                            </span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Tổng tiền:</span>
                                            <span className={styles.modalValue}>{formatPrice(selectedBooking.totalPrice)}</span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Trạng thái:</span>
                                            <span className={`${styles.statusBadge} ${getStatusClass(selectedBooking.status)}`}>
                                                {getStatusLabel(selectedBooking.status)}
                                            </span>
                                        </div>
                                        <div className={styles.modalRow}>
                                            <span className={styles.modalLabel}>Đặt lúc:</span>
                                            <span className={styles.modalValue}>{formatDateTime(selectedBooking.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    {selectedBooking.status === "PENDING" && (
                                        <>
                                            <button
                                                className={`${styles.actionButton} ${styles.actionButtonSuccess}`}
                                                onClick={() => handleUpdateBookingStatus(selectedBooking.id, "CONFIRMED")}
                                            >
                                                Xác nhận
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                                onClick={() => {
                                                    if (confirm("Bạn có chắc chắn muốn từ chối đơn đặt sân này?")) {
                                                        handleUpdateBookingStatus(selectedBooking.id, "CANCELLED");
                                                    }
                                                }}
                                            >
                                                Từ chối
                                            </button>
                                        </>
                                    )}
                                    {selectedBooking.status === "CONFIRMED" && (
                                        <button
                                            className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                                            onClick={() => handleUpdateBookingStatus(selectedBooking.id, "COMPLETED")}
                                        >
                                            Hoàn thành
                                        </button>
                                    )}
                                    <Link
                                        to={ROUTES.OWNER.COURT}
                                        className={styles.actionButton}
                                    >
                                        Xem chi tiết sân
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : viewMode === "table" ? (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Sân</th>
                                <th>Cơ sở</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Thời gian</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Đặt lúc</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className={styles.codeCell}>
                                        <span className={styles.bookingCode}>
                                            #{booking.id.substring(0, 8)}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            to={ROUTES.OWNER.COURT}
                                            className={styles.courtLink}
                                        >
                                            {booking.courtName}
                                        </Link>
                                    </td>
                                    <td>{booking.facilityName}</td>
                                    <td>
                                        <div className={styles.playerInfo}>
                                            <div className={styles.playerName}>{booking.playerName}</div>
                                            <div className={styles.playerContact}>
                                                📞 {booking.playerPhone}
                                            </div>
                                            <div className={styles.playerContact}>
                                                ✉️ {booking.playerEmail}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{formatDate(booking.bookingDate)}</td>
                                    <td>
                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                    </td>
                                    <td className={styles.priceCell}>
                                        <strong>{formatPrice(booking.totalPrice)}</strong>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                            {getStatusLabel(booking.status)}
                                        </span>
                                    </td>
                                    <td className={styles.dateCell}>
                                        {formatDateTime(booking.createdAt)}
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            {booking.status === "PENDING" && (
                                                <>
                                                    <button
                                                        className={`${styles.actionButton} ${styles.actionButtonSuccess}`}
                                                        onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                                        onClick={() => {
                                                            if (confirm("Bạn có chắc chắn muốn từ chối đơn đặt sân này?")) {
                                                                handleUpdateBookingStatus(booking.id, "CANCELLED");
                                                            }
                                                        }}
                                                    >
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === "CONFIRMED" && (
                                                <button
                                                    className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                                                    onClick={() => handleUpdateBookingStatus(booking.id, "COMPLETED")}
                                                >
                                                    Hoàn thành
                                                </button>
                                            )}
                                            <Link
                                                to={ROUTES.OWNER.COURT}
                                                className={styles.actionButton}
                                            >
                                                Chi tiết
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.bookingsGrid}>
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className={styles.bookingCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardHeaderLeft}>
                                    <span className={styles.bookingCode}>
                                        #{booking.id.substring(0, 8)}
                                    </span>
                                    <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                        {getStatusLabel(booking.status)}
                                    </span>
                                </div>
                                <div className={styles.cardHeaderRight}>
                                    <strong className={styles.cardPrice}>{formatPrice(booking.totalPrice)}</strong>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.cardSection}>
                                    <h3 className={styles.cardTitle}>
                                        <Link to={ROUTES.OWNER.COURT} className={styles.courtLink}>
                                            {booking.courtName}
                                        </Link>
                                    </h3>
                                    <p className={styles.facilityName}>{booking.facilityName}</p>
                                </div>

                                <div className={styles.cardSection}>
                                    <div className={styles.cardLabel}>Khách hàng</div>
                                    <div className={styles.playerInfo}>
                                        <div className={styles.playerName}>{booking.playerName}</div>
                                        <div className={styles.playerContact}>
                                            📞 {booking.playerPhone}
                                        </div>
                                        <div className={styles.playerContact}>
                                            ✉️ {booking.playerEmail}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.cardSection}>
                                    <div className={styles.cardRow}>
                                        <div className={styles.cardItem}>
                                            <span className={styles.cardLabel}>Ngày đặt:</span>
                                            <span className={styles.cardValue}>{formatDate(booking.bookingDate)}</span>
                                        </div>
                                        <div className={styles.cardItem}>
                                            <span className={styles.cardLabel}>Thời gian:</span>
                                            <span className={styles.cardValue}>
                                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.cardItem}>
                                        <span className={styles.cardLabel}>Đặt lúc:</span>
                                        <span className={styles.cardValue}>{formatDateTime(booking.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                {booking.status === "PENDING" && (
                                    <>
                                        <button
                                            className={`${styles.actionButton} ${styles.actionButtonSuccess}`}
                                            onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                                        >
                                            Xác nhận
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                            onClick={() => {
                                                if (confirm("Bạn có chắc chắn muốn từ chối đơn đặt sân này?")) {
                                                    handleUpdateBookingStatus(booking.id, "CANCELLED");
                                                }
                                            }}
                                        >
                                            Từ chối
                                        </button>
                                    </>
                                )}
                                {booking.status === "CONFIRMED" && (
                                    <button
                                        className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                                        onClick={() => handleUpdateBookingStatus(booking.id, "COMPLETED")}
                                    >
                                        Hoàn thành
                                    </button>
                                )}
                                <Link
                                    to={ROUTES.OWNER.COURT}
                                    className={styles.actionButton}
                                >
                                    Chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

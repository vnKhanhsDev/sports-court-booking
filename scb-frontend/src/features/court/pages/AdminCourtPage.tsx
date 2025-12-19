import { useState } from "react";
import useAdminFacilities from "../hooks/useAdminFacilities";
import AdminFacilityTable from "../lists/AdminFacilityList/AdminFacilityTable";
import TableToolbar from "@/components/common/TableToolbar/TableToolbar";
import Button from "@/components/ui/button/Button";
import type { AdminFacilitySummary } from "../types/facility.types";
import styles from "./AdminCourtPage.module.css";

export default function AdminCourtPage() {
    const {
        adminFacilities,
        isAdminFacilitiesLoading,
        approveFacility,
        rejectFacility,
        approveAllFacilities,
    } = useAdminFacilities();

    const [searchValue, setSearchValue] = useState("");

    // Filter facilities based on search
    const filteredFacilities = adminFacilities.filter((facility) => {
        if (!searchValue.trim()) return true;
        const searchLower = searchValue.toLowerCase();
        return (
            facility.name.toLowerCase().includes(searchLower) ||
            facility.ownerEmail.toLowerCase().includes(searchLower)
        );
    });

    // Get pending facilities count for approve all button
    const pendingCount = adminFacilities.filter(
        (f) => f.status === "PENDING"
    ).length;

    const handleApprove = async (facility: AdminFacilitySummary) => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn phê duyệt cơ sở "${facility.name}"?`
        );
        if (confirmed) {
            try {
                await approveFacility(facility.id);
            } catch (error: any) {
                const errorMessage =
                    error?.message || error?.error || "Có lỗi xảy ra khi phê duyệt cơ sở";
                alert(errorMessage);
            }
        }
    };

    const handleReject = async (facility: AdminFacilitySummary) => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn từ chối cơ sở "${facility.name}"?`
        );
        if (confirmed) {
            try {
                await rejectFacility(facility.id);
            } catch (error: any) {
                const errorMessage =
                    error?.message || error?.error || "Có lỗi xảy ra khi từ chối cơ sở";
                alert(errorMessage);
            }
        }
    };

    const handleApproveAll = async () => {
        if (pendingCount === 0) {
            alert("Không có cơ sở nào đang chờ phê duyệt");
            return;
        }

        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn phê duyệt tất cả ${pendingCount} cơ sở đang chờ?`
        );
        if (confirmed) {
            try {
                await approveAllFacilities();
            } catch (error: any) {
                const errorMessage =
                    error?.message || error?.error || "Có lỗi xảy ra khi phê duyệt tất cả cơ sở";
                alert(errorMessage);
            }
        }
    };

    return (
        <>
            <TableToolbar
                searchPlaceholder="Tìm kiếm theo tên cơ sở hoặc email..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                actions={
                    <Button
                        label={`Phê duyệt tất cả (${pendingCount})`}
                        onClick={handleApproveAll}
                        disabled={pendingCount === 0}
                        className={styles.toolbarButton}
                    />
                }
            />

            <AdminFacilityTable
                facilities={filteredFacilities}
                isLoading={isAdminFacilitiesLoading}
                title="Quản lý cơ sở"
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </>
    );
}
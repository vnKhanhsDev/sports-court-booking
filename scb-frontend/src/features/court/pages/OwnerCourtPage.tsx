import { useState } from "react";
import FacilityCardList from "../lists/FacilityList/FacilityCardList";
import CourtListTable from "../lists/CourtList/CourtTable";
import TableToolbar from "@/components/common/TableToolbar/TableToolbar";
import Modal from "@/components/ui/modal/Modal";
import Button from "@/components/ui/button/Button";
import FacilityForm, { type FacilityFormData } from "../forms/FacilityForm/FacilityForm";
import CourtForm from "../forms/CourtForm/CourtForm";
import type { OwnerCourtSummary, OwnerCourtDetail } from "../types/court.types";
import styles from "./OwnerCourtPage.module.css";
import usePriceList from "../hooks/usePriceList";
import useFacility from "../hooks/useFacility";
import { facilityService } from "../services/facilityService";
import { courtServiceForOwner } from "../services/courtService";
import type { FacilityCreation, FacilityDetail, FacilityUpdation } from "../types/facility.types";
import useApi from "@/hooks/useApi";
import useCourt from "../hooks/useCourt";

type FacilityModalMode = "create" | "view" | "edit";
type CourtModalMode = "create" | "view" | "edit";

export default function OwnerCourtPage() {
    const { facilities, isFacilitiesLoading, refetchFacilities } = useFacility();

    const { ownerCourts, isCourtsLoading, refetchCourts } = useCourt();
    const { priceListOptions } = usePriceList();
    const { execute } = useApi();
    
    const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
    const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
    const [facilityModalMode, setFacilityModalMode] = useState<FacilityModalMode>("create");
    const [courtModalMode, setCourtModalMode] = useState<CourtModalMode>("create");
    const [selectedFacilityDetail, setSelectedFacilityDetail] = useState<FacilityDetail | null>(null);
    const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
    const [selectedCourtDetail, setSelectedCourtDetail] = useState<OwnerCourtDetail | null>(null);
    const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);

    const handleFacilitySubmit = async (data: FacilityFormData) => {
        // Map form data to API payload
        if (!data.provinceCode || !data.districtCode || !data.wardCode) {
            alert("Vui lòng chọn đầy đủ Tỉnh / Quận / Phường trước khi lưu cơ sở.");
            return;
        }

        if (facilityModalMode === "create") {
            const payload: FacilityCreation = {
                name: data.name,
                description: data.description || null,
                openingTime: data.openingTime,
                closingTime: data.closingTime,
                provinceCode: data.provinceCode,
                districtCode: data.districtCode,
                wardCode: data.wardCode,
                addressDetail: data.address,
                geoLatitude: data.geoLatitude ?? null,
                geoLongitude: data.geoLongitude ?? null,
            };

            await execute(() => facilityService.createFacility(payload));
        } else if (facilityModalMode === "edit" && selectedFacilityId != null) {
            const payload: FacilityUpdation = {
                name: data.name,
                description: data.description || null,
                openingTime: data.openingTime,
                closingTime: data.closingTime,
                provinceCode: data.provinceCode,
                districtCode: data.districtCode,
                wardCode: data.wardCode,
                addressDetail: data.address,
                geoLatitude: data.geoLatitude ?? null,
                geoLongitude: data.geoLongitude ?? null,
                status: (data.status ?? selectedFacilityDetail?.status ?? "PENDING") as any,
            };

            await execute(() => facilityService.updateFacility(selectedFacilityId, payload));
        }

        await refetchFacilities();
        setIsFacilityModalOpen(false);
    };

    const handleFacilityCardClick = async (facilityId: number) => {
        const detail = await execute(() => facilityService.getFacilityById(facilityId));
        if (!detail) return;

        setSelectedFacilityDetail(detail);
        setSelectedFacilityId(facilityId);
        setFacilityModalMode("view");
        setIsFacilityModalOpen(true);
    };

    const handleFacilityEditClick = async (facilityId: number) => {
        const detail = await execute(() => facilityService.getFacilityById(facilityId));
        if (!detail) return;

        setSelectedFacilityDetail(detail);
        setSelectedFacilityId(facilityId);
        setFacilityModalMode("edit");
        setIsFacilityModalOpen(true);
    };

    const handleFacilityDeleteClick = async (facilityId: number) => {
        const facility = facilities.find((f) => f.id === facilityId);
        if (!facility) return;

        if (facility.totalCourts > 0) {
            alert("Không thể xóa cơ sở vì vẫn còn sân đang tồn tại.");
            return;
        }

        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa cơ sở này không?");
        if (!confirmed) return;

        await execute(() => facilityService.deleteFacility(facilityId));
        await refetchFacilities();
    };

    const handleCourtSubmit = async () => {
        // Refresh the courts list to show the newly added court
        await refetchCourts();
        setIsCourtModalOpen(false);
    };

    const handleCourtRowClick = async (court: OwnerCourtSummary) => {
        try {
            const detail = await execute(() => courtServiceForOwner.getCourtById(court.id));
            if (!detail) return;

            setSelectedCourtDetail(detail);
            setCourtModalMode("view");
            setIsCourtModalOpen(true);
        } catch (error: any) {
            console.error("Failed to fetch court details:", error);
            alert(error?.message || "Không thể tải thông tin sân. Vui lòng thử lại.");
        }
    };

    const handleEditCourt = async (court: OwnerCourtSummary) => {
        try {
            const detail = await execute(() => courtServiceForOwner.getCourtById(court.id));
            if (!detail) return;

            setSelectedCourtDetail(detail);
            setSelectedCourtId(court.id);
            setCourtModalMode("edit");
            setIsCourtModalOpen(true);
        } catch (error: any) {
            console.error("Failed to fetch court details:", error);
            alert(error?.message || "Không thể tải thông tin sân. Vui lòng thử lại.");
        }
    };

    const handleDeleteCourt = async (court: OwnerCourtSummary) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sân này không?");
        if (!confirmed) return;

        try {
            await execute(() => courtServiceForOwner.deleteCourt(court.id));
            await refetchCourts();
        } catch (error: any) {
            console.error("Failed to delete court:", error);
            alert(error?.message || "Không thể xóa sân. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <TableToolbar
                actions={
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            label="Thêm cơ sở"
                            onClick={() => {
                                setFacilityModalMode("create");
                                setSelectedFacilityDetail(null);
                                setSelectedFacilityId(null);
                                setIsFacilityModalOpen(true);
                            }}
                            className={styles.toolbarButton}
                        />
                        <Button
                            label="Thêm sân"
                            onClick={() => {
                                setCourtModalMode("create");
                                setSelectedCourtDetail(null);
                                setSelectedCourtId(null);
                                setIsCourtModalOpen(true);
                            }}
                            disabled={facilities.length === 0}
                            className={styles.toolbarButton}
                        />
                    </div>
                }
            />
            
            <FacilityCardList
                facilities={facilities}
                isLoading={isFacilitiesLoading}
                onFacilityClick={handleFacilityCardClick}
                onFacilityEditClick={handleFacilityEditClick}
                onFacilityDeleteClick={handleFacilityDeleteClick}
            />

            <CourtListTable 
                courts={ownerCourts} 
                isLoading={isCourtsLoading}
                onRowClick={handleCourtRowClick}
                onEdit={handleEditCourt}
                onDelete={handleDeleteCourt}
            />

            <Modal
                isOpen={isFacilityModalOpen}
                onClose={() => setIsFacilityModalOpen(false)}
                title={
                    facilityModalMode === "create"
                        ? "Thêm cơ sở mới"
                        : facilityModalMode === "edit"
                        ? "Chỉnh sửa cơ sở"
                        : "Chi tiết cơ sở"
                }
                size="large"
            >
                <FacilityForm 
                    onSubmit={facilityModalMode === "view" ? undefined : handleFacilitySubmit}
                    readOnly={facilityModalMode === "view"}
                    initialData={selectedFacilityDetail ? {
                        name: selectedFacilityDetail.name,
                        description: selectedFacilityDetail.description ?? "",
                        address: selectedFacilityDetail.addressDetail,
                        // Backend returns LocalTime as string, often 'HH:mm:ss' – trim to 'HH:mm' for selects
                        openingTime: selectedFacilityDetail.openingTime?.slice(0, 5),
                        closingTime: selectedFacilityDetail.closingTime?.slice(0, 5),
                        provinceCode: selectedFacilityDetail.provinceCode,
                        districtCode: selectedFacilityDetail.districtCode,
                        wardCode: selectedFacilityDetail.wardCode,
                        geoLatitude: selectedFacilityDetail.geoLatitude ?? undefined,
                        geoLongitude: selectedFacilityDetail.geoLongitude ?? undefined,
                        status: selectedFacilityDetail.status as any,
                    } : undefined}
                />
                <div className={styles.modalActions}>
                    <Button
                        type="button"
                        label="Hủy"
                        onClick={() => setIsFacilityModalOpen(false)}
                        className={styles.cancelButton}
                    />
                    {facilityModalMode !== "view" && (
                        <Button
                            type="button"
                            label="Lưu"
                            onClick={() => {
                                const form = document.querySelector('form') as HTMLFormElement;
                                if (form) {
                                    form.requestSubmit();
                                }
                            }}
                        />
                    )}
                </div>
            </Modal>

            <Modal
                isOpen={isCourtModalOpen}
                onClose={() => {
                    setIsCourtModalOpen(false);
                    setSelectedCourtDetail(null);
                    setSelectedCourtId(null);
                }}
                title={
                    courtModalMode === "create"
                        ? "Thêm sân mới"
                        : courtModalMode === "edit"
                        ? "Chỉnh sửa sân"
                        : "Chi tiết sân"
                }
                size="large"
            >
                <CourtForm 
                    facilities={facilities}
                    priceLists={priceListOptions}
                    onSubmit={courtModalMode === "view" ? undefined : handleCourtSubmit}
                    onCancel={() => {
                        setIsCourtModalOpen(false);
                        setSelectedCourtDetail(null);
                        setSelectedCourtId(null);
                    }}
                    readOnly={courtModalMode === "view"}
                    initialData={selectedCourtDetail || undefined}
                    mode={courtModalMode === "edit" ? "edit" : "create"}
                    courtId={courtModalMode === "edit" && selectedCourtId ? selectedCourtId : undefined}
                />
                {courtModalMode === "view" && (
                    <div className={styles.modalActions}>
                        <Button
                            type="button"
                            label="Đóng"
                            onClick={() => {
                                setIsCourtModalOpen(false);
                                setSelectedCourtDetail(null);
                            }}
                            className={styles.cancelButton}
                        />
                    </div>
                )}
            </Modal>
        </>
    );
}

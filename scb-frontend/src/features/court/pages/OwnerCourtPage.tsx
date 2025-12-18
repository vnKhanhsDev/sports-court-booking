import { useState } from "react";
import useCourtForOwner from "../hooks/useCourtForOwner";
import FacilityCardList from "../lists/FacilityList/FacilityCardList";
import CourtListTable from "../lists/CourtList/CourtTable";
import TableToolbar from "@/components/common/TableToolbar/TableToolbar";
import Modal from "@/components/ui/modal/Modal";
import Button from "@/components/ui/button/Button";
import FacilityForm, { type FacilityFormData } from "../forms/FacilityForm/FacilityForm";
import CourtForm from "../forms/CourtForm/CourtForm";
import type { CourtBasicForOwner } from "../types/court.types";
import styles from "./OwnerCourtPage.module.css";
import usePriceTemplate from "../hooks/usePriceTemplate";
import useFacility from "../hooks/useFacility";
import { facilityService } from "../services/facilityService";
import type { FacilityCreation, FacilityDetail, FacilityUpdation } from "../types/facility.types";
import useApi from "@/hooks/useApi";

type FacilityModalMode = "create" | "view" | "edit";

export default function OwnerCourtPage() {
    const { facilities, isFacilitiesLoading, refetchFacilities } = useFacility();

    const { courts, isLoading, refetch } = useCourtForOwner();
    const { priceTemplateOptions, isTemplatesLoading } = usePriceTemplate();
    const { execute } = useApi();
    
    const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
    const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
    const [facilityModalMode, setFacilityModalMode] = useState<FacilityModalMode>("create");
    const [selectedFacilityDetail, setSelectedFacilityDetail] = useState<FacilityDetail | null>(null);
    const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);

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

    const handleCourtSubmit = async (courtId: number) => {
        console.log("Court created with ID:", courtId);
        // Refresh the courts list to show the newly added court
        await refetch();
        setIsCourtModalOpen(false);
    };

    const handleEditCourt = (court: CourtBasicForOwner) => {
        console.log("Edit court:", court);
        // TODO: Implement edit court functionality
        // Open modal with court data pre-filled
    };

    const handleDeleteCourt = (court: CourtBasicForOwner) => {
        console.log("Delete court:", court);
        // TODO: Implement delete court functionality
        // Show confirmation dialog and delete
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
                            onClick={() => setIsCourtModalOpen(true)}
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
                courts={courts} 
                isLoading={isLoading}
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
                onClose={() => setIsCourtModalOpen(false)}
                title="Thêm sân mới"
                size="large"
            >
                <CourtForm 
                    facilities={facilities}
                    priceTemplates={priceTemplateOptions}
                    onSubmit={handleCourtSubmit}
                    onCancel={() => setIsCourtModalOpen(false)}
                />
            </Modal>
        </>
    );
}

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
import styles from "./CourtPageForOwner.module.css";
import usePriceTemplate from "../hooks/usePriceTemplate";

export default function CourtPageForOwner() {
    const { facilities, courts, isLoading, refetch } = useCourtForOwner();
    const { basicPriceTemplates, isTemplatesLoading } = usePriceTemplate();
    
    const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
    const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);

    const handleFacilitySubmit = (data: FacilityFormData) => {
        console.log("Facility form data:", data);
        // TODO: Implement API call to create facility
        setIsFacilityModalOpen(false);
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
                            onClick={() => setIsFacilityModalOpen(true)}
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
            
            <FacilityCardList facilities={facilities} isLoading={isLoading} />
            <CourtListTable 
                courts={courts} 
                isLoading={isLoading}
                onEdit={handleEditCourt}
                onDelete={handleDeleteCourt}
            />

            <Modal
                isOpen={isFacilityModalOpen}
                onClose={() => setIsFacilityModalOpen(false)}
                title="Thêm cơ sở mới"
                size="large"
            >
                <FacilityForm 
                    onSubmit={(data) => {
                        handleFacilitySubmit(data);
                    }}
                />
                <div className={styles.modalActions}>
                    <Button
                        type="button"
                        label="Hủy"
                        onClick={() => setIsFacilityModalOpen(false)}
                        className={styles.cancelButton}
                    />
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
                    priceTemplates={basicPriceTemplates}
                    onSubmit={handleCourtSubmit}
                    onCancel={() => setIsCourtModalOpen(false)}
                />
            </Modal>
        </>
    );
}
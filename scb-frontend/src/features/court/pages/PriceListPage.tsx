import { useState } from "react";
import usePriceList from "../hooks/usePriceList";
import PriceListTable from "../lists/PriceList/PriceListTable";
import TableToolbar from "@/components/common/TableToolbar/TableToolbar";
import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal/Modal";
import PriceListForm, { type PriceListFormValues } from "../forms/PriceListForm/PriceListForm";
import type { PriceListUpsert, PriceListDetail, PriceListSummary } from "../types/price.types";
import styles from "./PriceListPage.module.css";
import useApi from "@/hooks/useApi";
import { priceListService } from "../services/priceListService";

export default function PriceListPage() {
    const { priceLists, isPriceListsLoading, createPriceList, updatePriceList, deletePriceList } = usePriceList();
    const { execute, isLoading: isDetailLoading } = useApi();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPriceListDetail, setSelectedPriceListDetail] = useState<PriceListDetail | null>(null);
    const [formMode, setFormMode] = useState<"create" | "view" | "edit">("create");

    const handleDeletePriceList = async (priceList: PriceListSummary) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa bảng giá "${priceList.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePriceList(priceList.id);
        } catch (error: any) {
            // Check if error is about price list being in use
            const errorMessage = error?.message || error?.error || "Có lỗi xảy ra khi xóa bảng giá";
            
            if (errorMessage.includes("being used") || errorMessage.includes("đang được sử dụng") || errorMessage.includes("cannot be deleted")) {
                alert("Bảng giá này đang được sử dụng bởi một sân và không thể xóa.");
            } else {
                alert(errorMessage);
            }
        }
    };

    const handleRowClick = async (priceList: PriceListSummary) => {
        const detail = await execute(() => priceListService.getPriceListById(priceList.id));
        if (!detail) {
            alert("Không tìm thấy thông tin bảng giá");
            return;
        }

        setSelectedPriceListDetail(detail);
        setFormMode("view");
        setIsFormOpen(true);
    };

    const handleEditPriceList = async (priceList: PriceListSummary) => {
        const detail = await execute(() => priceListService.getPriceListById(priceList.id));
        if (!detail) {
            alert("Không tìm thấy thông tin bảng giá");
            return;
        }

        setSelectedPriceListDetail(detail);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    const handleCreatePriceList = async (values: PriceListFormValues) => {
        const payload: PriceListUpsert = {
            facilityId: values.facilityId,
            sportId: values.sportId,
            courtTypeId: values.courtTypeId,
            surfaceTypeId: values.surfaceTypeId,
            name: values.name,
            note: values.note ?? null,
            isActive: values.isActive,
            slots: values.slots,
        };

        await createPriceList(payload);
        setIsFormOpen(false);
    };

    const handleUpdatePriceList = async (values: PriceListFormValues) => {
        if (!selectedPriceListDetail) {
            alert("Không tìm thấy thông tin bảng giá để cập nhật");
            return;
        }

        const payload: PriceListUpsert = {
            facilityId: values.facilityId,
            sportId: values.sportId,
            courtTypeId: values.courtTypeId,
            surfaceTypeId: values.surfaceTypeId,
            name: values.name,
            note: values.note ?? null,
            isActive: values.isActive,
            slots: values.slots,
        };

        await updatePriceList(selectedPriceListDetail.id, payload);
        setIsFormOpen(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedPriceListDetail(null);
        setFormMode("create");
        setIsFormOpen(true);
    };

    return (
        <>
            <TableToolbar
                actions={
                    <Button
                        label="Thêm bảng giá"
                        onClick={handleOpenCreateForm}
                        className={styles.toolbarButton}
                    />
                }
            />

            <PriceListTable
                priceLists={priceLists}
                isLoading={isPriceListsLoading}
                onRowClick={handleRowClick}
                onEdit={handleEditPriceList}
                onDelete={handleDeletePriceList}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedPriceListDetail(null);
                }}
                title={
                    formMode === "view"
                        ? "Chi tiết bảng giá"
                        : formMode === "edit"
                        ? "Chỉnh sửa bảng giá"
                        : "Thêm bảng giá mới"
                }
                size="large"
            >
                {!isDetailLoading && (
                    <PriceListForm
                        mode={formMode}
                        initialValues={
                            selectedPriceListDetail
                                ? {
                                      facilityId: selectedPriceListDetail.facilityId,
                                      sportId: selectedPriceListDetail.sportId,
                                      courtTypeId: selectedPriceListDetail.courtTypeId,
                                      surfaceTypeId: selectedPriceListDetail.surfaceTypeId,
                                      name: selectedPriceListDetail.name,
                                      note: selectedPriceListDetail.note ?? undefined,
                                      isActive: selectedPriceListDetail.isActive,
                                      slots: selectedPriceListDetail.slots,
                                  }
                                : undefined
                        }
                        onSubmit={
                            formMode === "create"
                                ? handleCreatePriceList
                                : formMode === "edit"
                                ? handleUpdatePriceList
                                : undefined
                        }
                        onCancel={() => setIsFormOpen(false)}
                    />
                )}
            </Modal>
        </>
    );
}

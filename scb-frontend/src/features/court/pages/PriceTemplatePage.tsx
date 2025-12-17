import { useState } from "react";
import usePriceTemplate from "../hooks/usePriceTemplate";
import PriceTemplateTable from "../lists/PriceTemplateList/PriceTemplateTable";
import TableToolbar from "@/components/common/TableToolbar/TableToolbar";
import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal/Modal";
import PriceTemplateForm, { type PriceTemplateFormValues } from "../forms/PriceTemplateForm/PriceTemplateForm";
import type { PriceTemplateUpsert, PriceTemplateDetail, PriceTemplateSummary } from "../types/price.types";
import styles from "./PriceTemplatePage.module.css";
import useApi from "@/hooks/useApi";
import { priceTemplateService } from "../services/priceTemplateService";

export default function PriceTemplatePage() {
    const { priceTemplates, isTemplatesLoading, createPriceTemplate, updatePriceTemplate, deletePriceTemplate } = usePriceTemplate();
    const { execute, isLoading: isDetailLoading } = useApi();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTemplateDetail, setSelectedTemplateDetail] = useState<PriceTemplateDetail | null>(null);
    const [formMode, setFormMode] = useState<"create" | "view" | "edit">("create");

    const handleDeletePriceTemplate = async (priceTemplate: PriceTemplateSummary) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa bảng giá "${priceTemplate.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePriceTemplate(priceTemplate.id);
        } catch (error: any) {
            // Check if error is about template being in use
            const errorMessage = error?.message || error?.error || "Có lỗi xảy ra khi xóa bảng giá";
            
            if (errorMessage.includes("being used") || errorMessage.includes("đang được sử dụng") || errorMessage.includes("cannot be deleted")) {
                alert("Bảng giá này đang được sử dụng bởi một sân và không thể xóa.");
            } else {
                alert(errorMessage);
            }
        }
    };

    const handleRowClick = async (priceTemplate: PriceTemplateSummary) => {
        const detail = await execute(() => priceTemplateService.getPriceTemplateById(priceTemplate.id));
        if (!detail) {
            alert("Không tìm thấy thông tin bảng giá");
            return;
        }

        setSelectedTemplateDetail(detail);
        setFormMode("view");
        setIsFormOpen(true);
    };

    const handleEditPriceTemplate = async (priceTemplate: PriceTemplateSummary) => {
        const detail = await execute(() => priceTemplateService.getPriceTemplateById(priceTemplate.id));
        if (!detail) {
            alert("Không tìm thấy thông tin bảng giá");
            return;
        }

        setSelectedTemplateDetail(detail);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    const handleCreateTemplate = async (values: PriceTemplateFormValues) => {
        const payload: PriceTemplateUpsert = {
            facilityId: values.facilityId,
            sportId: values.sportId,
            courtTypeId: values.courtTypeId,
            surfaceTypeId: values.surfaceTypeId,
            name: values.name,
            description: values.description ?? null,
            isActive: values.isActive,
            items: values.items,
        };

        await createPriceTemplate(payload);
        setIsFormOpen(false);
    };

    const handleUpdateTemplate = async (values: PriceTemplateFormValues) => {
        if (!selectedTemplateDetail) {
            alert("Không tìm thấy thông tin bảng giá để cập nhật");
            return;
        }

        const payload: PriceTemplateUpsert = {
            facilityId: values.facilityId,
            sportId: values.sportId,
            courtTypeId: values.courtTypeId,
            surfaceTypeId: values.surfaceTypeId,
            name: values.name,
            description: values.description ?? null,
            isActive: values.isActive,
            items: values.items,
        };

        await updatePriceTemplate(selectedTemplateDetail.id, payload);
        setIsFormOpen(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedTemplateDetail(null);
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

            <PriceTemplateTable
                priceTemplates={priceTemplates}
                isLoading={isTemplatesLoading}
                onRowClick={handleRowClick}
                onEdit={handleEditPriceTemplate}
                onDelete={handleDeletePriceTemplate}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedTemplateDetail(null);
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
                    <PriceTemplateForm
                        mode={formMode}
                        initialValues={
                            selectedTemplateDetail
                                ? {
                                      facilityId: selectedTemplateDetail.facilityId,
                                      sportId: selectedTemplateDetail.sportId,
                                      courtTypeId: selectedTemplateDetail.courtTypeId,
                                      surfaceTypeId: selectedTemplateDetail.surfaceTypeId,
                                      name: selectedTemplateDetail.name,
                                      description: selectedTemplateDetail.description ?? undefined,
                                      isActive: selectedTemplateDetail.isActive,
                                      items: selectedTemplateDetail.items,
                                  }
                                : undefined
                        }
                        onSubmit={
                            formMode === "create"
                                ? handleCreateTemplate
                                : formMode === "edit"
                                ? handleUpdateTemplate
                                : undefined
                        }
                        onCancel={() => setIsFormOpen(false)}
                    />
                )}
            </Modal>
        </>
    );
}

import usePriceTemplateForOwner from "../hooks/usePriceTemplateForOwner";
import PriceTemplateListTable from "../components/layout/PriceTemplateListTable";
import TableToolbar from "@/components/common/TableToolbar/TableToolbar";
import Button from "@/components/ui/button/Button";
import type { PriceTemplateBasic } from "../types/price.types";
import styles from './PriceTemplatePageForOwner.module.css';

export default function PriceTemplatePageForOwner() {
    const { priceTemplates, isLoading } = usePriceTemplateForOwner();

    const handleEditPriceTemplate = (priceTemplate: PriceTemplateBasic) => {
        console.log("Edit price template:", priceTemplate);
        // TODO: Implement edit price template functionality
    };

    const handleDeletePriceTemplate = (priceTemplate: PriceTemplateBasic) => {
        console.log("Delete price template:", priceTemplate);
        // TODO: Implement delete price template functionality
    };

    return (
        <>
            <TableToolbar
                actions={
                    <Button
                        label="Thêm bảng giá"
                        onClick={() => {
                            // TODO: Implement add price template functionality
                            console.log("Add price template");
                        }}
                        className={styles.toolbarButton}
                    />
                }
            />
            
            <PriceTemplateListTable 
                priceTemplates={priceTemplates} 
                isLoading={isLoading}
                onEdit={handleEditPriceTemplate}
                onDelete={handleDeletePriceTemplate}
            />
        </>
    );
}
import PublicCourtCard from "@/components/common/card/court/PublicCourtCard";
import { type PublicCourt } from "@/types/court.types";

export default function CourtList({ courts = [] }: { courts?: PublicCourt[] }) {
    if(courts.length === 0)
        return <div className='text-center text-gray-500'>Không có dữ liệu sân</div>;

    return (
        <div className='grid grid-cols-3 gap-4'>
            {courts.map((court) => (
                <PublicCourtCard key={court.id} court={court} />
            ))}
        </div>
    );
};
import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { type PublicCourt } from "@/types/court.types";
import HorizontalCardList from "@/components/common/HorizontalCardList/HorizontalCardList";
import PublicCourtCard from "@/components/common/card/court/PublicCourtCard";

function NearbyCourts() {
    const { location, loading, error } = useGeolocation();
    const [courts, setCourts] = useState<PublicCourt[]>([]);

    useEffect(() => {
        if (!location) return;

        const fetchNearbyCourts = async () => {};

        fetchNearbyCourts();
    }, [location]);

    if(loading) return <div>Đang tải dữ liệu...</div>;
    if(error) return <div>Lỗi: {error}</div>;

    return (
        <div className='bg-gray-100'>
            <div className="container mx-auto max-w-[1200px] py-6">
                <HorizontalCardList
                    title="Sân gần bạn"
                    viewAllLink="/courts"
                    items={courts}
                    renderItem={(court: PublicCourt) => <PublicCourtCard court={court} />}
                />
            </div>
        </div>
    );
};

export default NearbyCourts;
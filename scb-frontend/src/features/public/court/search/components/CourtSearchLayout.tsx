import SidebarFilters from "./SidebarFilters/SidebarFilters";
import SortBar from "./SortBar/SortBar";
import CourtList from "./CourtList/CourtList";
import Pagination from "./Pagination/Pagination";
import { type PublicCourt } from "@/types/court.types";

type CourtSearchLayoutProps = {
    courts?: PublicCourt[];
};

export default function CourtSearchLayout({
    courts = [],
}: CourtSearchLayoutProps) {
    return (
        <div className='grid grid-cols-[250px_1fr] gap-6'>
            <SidebarFilters />

            <div>
                <SortBar />
                <CourtList courts={courts} />
                <Pagination />
            </div>
        </div>
    );
};
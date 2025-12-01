import CourtSearchLayout from "./components/CourtSearchLayout";
import { publicCourts } from "@/mocks/court.mocks";

export default function CourtSearchPage() {
    const courts = publicCourts;

    return (
        <div className="container mx-auto max-w-[1200px] py-6">
            <CourtSearchLayout courts={courts} />
        </div>
    );
};
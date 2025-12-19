import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/route";

export default function AdminHomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to admin courts page (facility management)
        navigate(ROUTES.ADMIN.COURTS, { replace: true });
    }, [navigate]);

    return null;
}

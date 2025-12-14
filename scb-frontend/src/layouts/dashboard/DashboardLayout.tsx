import { Outlet } from "react-router-dom";
import DashboardSidebar from "./sidebar/DashboardSidebar";
import DashboardHeader from "./header/DashboardHeader";
import type { UserRole } from "@/types/user.types";
import { SIDEBAR_ITEMS } from "./sidebar/items";

export default function DashboardLayout({ role }: { role: UserRole }) {
    return (
        <div className="w-screen h-screen flex overflow-hidden bg-slate-50">
            <DashboardSidebar items={SIDEBAR_ITEMS[role] ?? []} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title={"Test"} />
                <div className="flex-1 overflow-x-hidden overflow-y-auto p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
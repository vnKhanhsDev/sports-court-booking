import { NavLink } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";
import type { SidebarItem } from "./items";
import AppLogo from "@/layouts/shared/AppLogo";

export default function DashboardSidebar({ items }: { items: SidebarItem[] }) {
    return (
        <aside className={styles.sidebar} aria-label="Dashboard navigation">
            <header className={styles.header}>
                <AppLogo 
                    variant="full"
                    heading="Bảng điều khiển"
                    kicker="Sports Court Booking"
                    badgeText="SCB"
                />
            </header>

            <nav className={styles.nav}>
                {items.length === 0 ? (
                    <div className={styles.emptyState}>
                        Không có mục điều hướng cho vai trò hiện tại.
                    </div>
                ) : (
                    items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.active : ''}`
                            }
                            end
                        >
                            <span className={styles.dot} />
                            <span className={styles.label}>{item.label}</span>
                        </NavLink>
                    ))
                )}
            </nav>
        </aside>
    );
}
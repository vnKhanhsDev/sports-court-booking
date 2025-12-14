import { Link, NavLink } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";
import type { SidebarItem } from "./items";
import { ROUTES } from "@/constants/route";

export default function DashboardSidebar({ items }: { items: SidebarItem[] }) {
    return (
        <aside className={styles.sidebar} aria-label="Dashboard navigation">
            <header className={styles.header}>
                <Link to={ROUTES.PUBLIC.HOME} className={styles.brandLink}>
                    <div className={styles.brandBadge}>SCB</div>
                    <div>
                        <p className={styles.kicker}>Sports Court Booking</p>
                        <h2 className={styles.heading}>Bảng điều khiển</h2>
                    </div>
                </Link>
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
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/components/ui/icons";
import styles from "./HeaderUser.module.css";
import { USER_ROLES } from "@/constants/role";
import clsx from "clsx";

interface HeaderUser {
    size: "sm" | "md";
    className?: string;
}

export default function HeaderUser({
    size = "md",
    className = ""
}: HeaderUser) {
    const { activeRole, user } = useAuth();
    const [theme, setTheme] = useState<"light" | "dark" | "system">("light"); // TODO: wire to real theme manager
    
    const roleLabel = useMemo(() => {
        switch (activeRole) {
            case USER_ROLES.ADMIN:
                return 'Quản trị viên';
            case USER_ROLES.OWNER:
                return 'Chủ sân';
            case USER_ROLES.PLAYER:
                return 'Người dùng';
        }
    }, [activeRole]);

    return (
        <div className={styles.wrapper}>
            <div className={clsx(styles.user, styles[size], className)}>
                <div className={styles.avatar}>
                    {user?.avatarUrl ? (
                        <img
                            src={user?.avatarUrl}
                            alt={user?.username}
                            loading="lazy"
                        />
                    ) : (
                        <User />
                    )}
                </div>
                <div className={styles.info}>
                    <span className={styles.username}>{user?.username}</span>
                    <span className={styles.role}>{roleLabel}</span>
                </div>
            </div>

            <div className={styles.dropdown}>
                <div className={styles.themeWrapper}>
                    <div className={styles.themeSwitch}>
                        {["light", "dark", "system"].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setTheme(option as typeof theme)}
                                className={clsx(
                                    styles.themeButton,
                                    theme === option && styles.themeButtonActive
                                )}
                                aria-pressed={theme === option}
                            >
                                <span className={styles.themeIcon}>
                                    {option === "light" && "☀️"}
                                    {option === "dark" && "🌙"}
                                    {option === "system" && "🖥️"}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <Link to="#" className={styles.dropdownItem}>
                    <span>Cài đặt</span>
                </Link>
                <Link to="#" className={styles.dropdownItem}>
                    <span>Tài khoản của tôi</span>
                </Link>
                <button className={styles.dropdownItem}>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}
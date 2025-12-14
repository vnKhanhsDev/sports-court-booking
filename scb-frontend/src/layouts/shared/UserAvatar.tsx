import { useMemo, useState } from "react";
import styles from "./UserAvatar.module.css";

export interface UserAvatarProps {
    username?: string | null;
    avatarUrl?: string;
    subtitle?: string;
    size?: "md" | "sm";
    onClick?: () => void;
    className?: string;
}

const getInitials = (username?: string | null) => {
    const safeName = username?.trim();
    if (!safeName) return "U";
    const parts = safeName.split(/\s+/);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export default function UserAvatar({
    username = "Người dùng",
    avatarUrl,
    subtitle,
    size = "md",
    onClick,
    className = ""
}: UserAvatarProps) {
    const [imgError, setImgError] = useState(false);
    const initials = useMemo(() => getInitials(username), [username]);
    const showImage = avatarUrl && !imgError;

    return (
        <button
            type="button"
            className={`${styles.wrapper} ${size === "sm" ? styles.sm : ""} ${className}`}
            onClick={onClick}
        >
            <span className={styles.avatar} aria-label={`Avatar của ${username}`}>
                {showImage ? (
                    <img
                        src={avatarUrl}
                        alt={username ?? "avatar"}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    initials
                )}
            </span>

            <span className={styles.info}>
                <span className={styles.name}>{username}</span>
                {subtitle ? <span className={styles.secondary}>{subtitle}</span> : null}
            </span>
        </button>
    );
}


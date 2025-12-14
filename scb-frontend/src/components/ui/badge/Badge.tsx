import clsx from "clsx";
import styles from "./Badge.module.css";

interface BadgeProps {
    label: string;
    variant: "default" | "success" | "danger" | "warning" | "info";
}

export default function Badge({ label, variant = "default" }: BadgeProps) {
    return (
        <span className={clsx(styles.wrapper, styles[variant])}>
            {label}
        </span>
    );
}
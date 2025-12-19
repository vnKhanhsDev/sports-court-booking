import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/route";
import styles from "./AppLogo.module.css";

export type AppLogoVariant = "full" | "badge";

export interface AppLogoProps {
    /**
     * Display variant: "full" shows badge + text, "badge" shows only the badge
     * @default "full"
     */
    variant?: AppLogoVariant;
    
    /**
     * The heading text to display (only shown in "full" variant)
     * @default "Bảng điều khiển"
     */
    heading?: string;
    
    /**
     * The kicker/subtitle text (only shown in "full" variant)
     * @default "Sports Court Booking"
     */
    kicker?: string;
    
    /**
     * The badge text/initials
     * @default "SCB"
     */
    badgeText?: string;
    
    /**
     * Custom link destination. If not provided, defaults to home page
     */
    to?: string;
    
    /**
     * Additional CSS class name
     */
    className?: string;
}

export default function AppLogo({
    variant = "full",
    heading = "Bảng điều khiển",
    kicker = "Sports Court Booking",
    badgeText = "SCB",
    to = ROUTES.PUBLIC.HOME,
    className = ""
}: AppLogoProps) {
    return (
        <Link 
            to={to} 
            className={`${styles.logoLink} ${variant === "badge" ? styles.badgeOnly : ""} ${className}`}
            aria-label="Go to home page"
        >
            <div className={styles.badge}>{badgeText}</div>
            {variant === "full" && (
                <div className={styles.textContainer}>
                    <p className={styles.kicker}>{kicker}</p>
                    <h2 className={styles.heading}>{heading}</h2>
                </div>
            )}
        </Link>
    );
}

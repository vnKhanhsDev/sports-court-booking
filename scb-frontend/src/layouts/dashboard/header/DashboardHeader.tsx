import BackIcon from "@/components/ui/icons/Back";
import HeaderUser from "@/layouts/shared/HeaderUser";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader({ title }: { title: string }) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button type="button" className={styles.backButton}>
                    <BackIcon className={styles.backIcon} />
                </button>
                <h1 className={styles.title}>{title}</h1>
            </div>

            <HeaderUser
                size="md"
                className={styles.user}
            />
        </header>
    );
}

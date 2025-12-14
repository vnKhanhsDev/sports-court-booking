import styles from "./TableToolbar.module.css";
import Search from "@/components/ui/icons/Search";

interface TableToolbarProps {
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    hideSearch?: boolean;
    actions?: React.ReactNode;
    filters?: React.ReactNode;
}

export default function TableToolbar({
    searchPlaceholder = "Search...",
    searchValue = "",
    onSearchChange,
    hideSearch = false,
    actions,
    filters
}: TableToolbarProps) {
    return (
        <section className={styles.toolbar}>
            <div className={styles.top}>
                {!hideSearch && (
                    <div className={styles.search}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                )}

                {actions && (
                    <div className={styles.actions}>
                        {actions}
                    </div>
                )}
            </div>

            {filters && (
                <div className={styles.bottom}>
                    <div className={styles.filters}>
                        {filters}
                    </div>
                </div>
            )}
        </section>
    );
}
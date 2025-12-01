import React, { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./HorizontalCardList.module.css";

interface HorizontalCardListProps<T> {
    title: string;
    viewAllLink?: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function HorizontalCardList<T>({
    title,
    viewAllLink,
    items,
    renderItem,
}: HorizontalCardListProps<T>) {
    const listRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (!listRef.current) return;
        const containerWidth = listRef.current.clientWidth || 0;
        const scrollAmount = containerWidth * 0.8;

        listRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>

                {viewAllLink && (
                    <Link to={viewAllLink} className={styles.viewAll}>
                        Xem tất cả →
                    </Link>
                )}
            </div>

            <div className={styles.listWrapper}>
                {items.length > 0 ? (
                    <>
                        <button
                            type="button"
                            aria-label="Scroll left"
                            className={`${styles.arrow} ${styles.arrowLeft}`}
                            onClick={() => handleScroll("left")}
                        >
                            ‹
                        </button>

                        <div ref={listRef} className={styles.list}>
                            {items.map((item, index) => (
                                <div key={index} className={styles.item}>
                                    {renderItem(item)}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            aria-label="Scroll right"
                            className={`${styles.arrow} ${styles.arrowRight}`}
                            onClick={() => handleScroll("right")}
                        >
                            ›
                        </button>
                    </>
                ) : (
                    <div className={styles.empty}>
                        <p className={styles.emptyText}>Không có dữ liệu</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default HorizontalCardList;
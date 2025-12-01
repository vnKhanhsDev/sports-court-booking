import styles from './SortBar.module.css';

export default function SortBar() {
    const sorts = [
        { id: 'keyword', name: 'từ khoá' },
        { id: 'newest', name: 'sân mới' },
        { id: 'most-rented', name: 'sân được thuê nhiều' }
    ];

    return (
        <div className={`flex items-center gap-2 ${styles.sortBar}`}>
            <p className={styles.sortBar__label}>Sắp xếp theo</p>

            {sorts.map((sort) => (
                <button key={sort.id} className={styles.sortBar__button}>{sort.name}</button>
            ))}

            <select name="" id="" className={styles.sortBar__select}>
                <option value="price-asc">Giá từ thấp đến cao</option>
                <option value="price-desc">Giá từ cao đến thấp</option>
            </select>
        </div>
    );
};
import { Link } from 'react-router-dom';
import styles from './PublicCourtCard.module.css';
import { type PublicCourt } from '@/types/court.types';

export interface PublicCourtCardProps {
    court?: PublicCourt;
}

const PublicCourtCard = ({ court: propCourt }: PublicCourtCardProps) => {
    return (
        <Link 
            to={`/court/${propCourt?.id}`}
            className={`${styles.courtCard} flex flex-col bg-white p-3`}
        >
            <div className={styles.imageContainer}>
                <img src={propCourt?.image} alt={propCourt?.courtName} className={styles.courtImage} />
            </div>

            <div className={`${styles.courtName} py-2`}>
                <h3 className={styles.facilityName}>{propCourt?.facilityName}</h3>
                <p className={styles.name}>({propCourt?.courtName})</p>
            </div>

            <div className={styles.courtPrice}>
                <span className={styles.priceFrom}>Giá từ: {propCourt?.minPrice}₫</span>
            </div>

            <div className={`${styles.courtMoreInfo} flex flex-col gap-1`}>
                <div className='flex items-center justify-between gap-1'>
                    <p>Môn: {propCourt?.sportType}</p>
                    <span>•</span>
                    <p>Mặt sân: {propCourt?.surfaceType}</p>
                </div>
                <p>Khu vực: {propCourt?.address}</p>
            </div>

        </Link>
    );
};

export default PublicCourtCard;
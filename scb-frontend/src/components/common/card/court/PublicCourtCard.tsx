import { Link } from 'react-router-dom';
import styles from './PublicCourtCard.module.css';

export interface Court {
    id: number;
    facilityName: string;
    sportType: string;
    surfaceType: string;
    name: string;
    priceFrom: string;
    image: string;
    address?: string;
}

export interface PublicCourtCardProps {
    court?: Court;
}

const PublicCourtCard = ({ court: propCourt }: PublicCourtCardProps) => {
    const defaultCourt: Court = {
        id: 1,
        facilityName: 'Sân thể thao Benten',
        sportType: 'Bóng đá',
        surfaceType: 'Cỏ nhân tạo',
        name: 'Sân 7A',
        priceFrom: '100.000',
        image: 'https://atsport.vn/wp-content/uploads/2021/08/kich-thuoc-san-bong-da-7-nguoi-co-nhan-tao-1-1-960x960-960x960-960x960.jpg',
        address: 'Quận Cầu Giấy, Hà Nội'
    };

    const court = propCourt || defaultCourt;

    return (
        <Link 
            to={`/court/${court.id}`}
            className={`${styles.courtCard} flex flex-col bg-white p-3`}
        >
            <div className={styles.imageContainer}>
                <img src={court.image} alt={court.name} className={styles.courtImage} />
            </div>

            <div className={`${styles.courtName} py-2`}>
                <h3 className={styles.facilityName}>{court.facilityName}</h3>
                <p className={styles.name}>({court.name})</p>
            </div>

            <div className={styles.courtPrice}>
                <span className={styles.priceFrom}>Giá từ: {court.priceFrom}₫</span>
            </div>

            <div className={`${styles.courtMoreInfo} flex flex-col gap-1`}>
                <div className='flex items-center justify-between gap-1'>
                    <p>Môn: {court.sportType}</p>
                    <span>•</span>
                    <p>Mặt sân: {court.surfaceType}</p>
                </div>
                <p>Khu vực: {court.address}</p>
            </div>

        </Link>
    );
};

export default PublicCourtCard;
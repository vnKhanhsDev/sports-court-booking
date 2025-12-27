import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/route';
import styles from './AdvertisementBanner.module.css';

interface QuickLink {
    id: number;
    label: string;
    icon: string;
    url: string;
}

const quickLinks: QuickLink[] = [
    { id: 1, label: 'Sân thể thao', icon: 'https://res.cloudinary.com/dfconmate/image/upload/v1766821546/ql-court-icon_mlkchk.png', url: ROUTES.PUBLIC.MARKETPLACE.SEARCH },
    { id: 2, label: 'Tìm bạn chơi', icon: 'https://res.cloudinary.com/dfconmate/image/upload/v1766821546/ql-playmate-icon_gnvsrz.png', url: ROUTES.PUBLIC.MARKETPLACE.HOME },
    { id: 3, label: 'Giải đấu', icon: 'https://res.cloudinary.com/dfconmate/image/upload/v1766821546/ql-competition-icon_zfossd.png', url: ROUTES.PUBLIC.MARKETPLACE.HOME },
    { id: 4, label: 'Cộng đồng', icon: 'https://res.cloudinary.com/dfconmate/image/upload/v1766821546/ql-community-icon_zfbj3r.png', url: ROUTES.PUBLIC.MARKETPLACE.HOME },
    { id: 5, label: 'Về chúng tôi', icon: 'https://res.cloudinary.com/dfconmate/image/upload/v1766821546/ql-aboutus-icon_ukdieg.png', url: ROUTES.PUBLIC.MARKETPLACE.HOME },
    { id: 6, label: 'Hỗ trợ', icon: 'https://res.cloudinary.com/dfconmate/image/upload/v1766821546/ql-support-icon_jhj4cc.png', url: ROUTES.PUBLIC.MARKETPLACE.HOME }
];

export default function AdvertisementBanner() {
    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <div className={styles.carousel}></div>

                <div className={styles.static}>
                    <div className={styles.staticItem} />
                    <div className={styles.staticItem} />
                </div>
            </div>

            <div className={styles.quickLinks}>
                {quickLinks.map((link) => (
                    <div key={link.id} className={styles.quickLinkItem}>
                        <Link to={link.url} className={styles.link}>
                            <div className={styles.iconWrapper}>
                                <img src={link.icon} alt={link.label} className={styles.icon} />
                            </div>
                            <span>{link.label}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { Link } from "react-router-dom";
import AppLogo from "@/layouts/shared/AppLogo";
import { Facebook, Instagram, Zalo, Google } from "@/components/ui/icons";
import { ROUTES } from "@/constants/route";
import { USER_ROLES } from "@/constants/role";
import styles from "./MainFooter.module.css";

export default function MainFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Column 1: Logo, Slogan, Social Media */}
                        <div className={styles.column}>
                            <div className={styles.logoSection}>
                                <AppLogo 
                                    variant="full"
                                    heading="Sports Court Booking"
                                    kicker="Đặt sân thể thao"
                                    badgeText="SCB"
                                />
                            </div>
                            <p className={styles.slogan}>
                                Kết nối cộng đồng thể thao - Đặt sân nhanh chóng, tiện lợi
                            </p>
                            <div className={styles.socialMedia}>
                                <a 
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Facebook"
                                >
                                    <Facebook className={styles.socialIcon} />
                                </a>
                                <a 
                                    href="https://instagram.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Instagram"
                                >
                                    <Instagram className={styles.socialIcon} />
                                </a>
                                <a 
                                    href="https://zalo.me" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Zalo"
                                >
                                    <Zalo className={styles.socialIcon} />
                                </a>
                                <a 
                                    href="https://gmail.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Google"
                                >
                                    <Google className={styles.socialIcon} />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className={styles.column}>
                            <h3 className={styles.columnTitle}>Liên kết nhanh</h3>
                            <ul className={styles.linkList}>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.SEARCH} className={styles.link}>
                                        Tìm sân thể thao
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Về chúng tôi
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Câu hỏi thường gặp
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Hỗ trợ khách hàng
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Contact Information */}
                        <div className={styles.column}>
                            <h3 className={styles.columnTitle}>Thông tin liên hệ</h3>
                            <ul className={styles.contactList}>
                                <li className={styles.contactItem}>
                                    <span className={styles.contactLabel}>Email:</span>
                                    <a 
                                        href="mailto:support@scb.com" 
                                        className={styles.contactLink}
                                    >
                                        support@scb.com
                                    </a>
                                </li>
                                <li className={styles.contactItem}>
                                    <span className={styles.contactLabel}>Hotline:</span>
                                    <a 
                                        href="tel:+84123456789" 
                                        className={styles.contactLink}
                                    >
                                        0123 456 789
                                    </a>
                                </li>
                                <li className={styles.contactItem}>
                                    <span className={styles.contactLabel}>Địa chỉ:</span>
                                    <span className={styles.contactText}>
                                        123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Policy & User Guide */}
                        <div className={styles.column}>
                            <h3 className={styles.columnTitle}>Chính sách & Hướng dẫn</h3>
                            <ul className={styles.linkList}>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Chính sách bảo mật
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Điều khoản sử dụng
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Hướng dẫn đặt sân
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Chính sách hoàn tiền
                                    </Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PUBLIC.MARKETPLACE.HOME} className={styles.link}>
                                        Câu hỏi thường gặp
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-section: Copyright & Internal Login */}
            <div className={styles.subSection}>
                <div className={styles.container}>
                    <div className={styles.subSectionContent}>
                        <p className={styles.copyright}>
                            © 2025 - Bản quyền thuộc về SCB Group
                        </p>
                        <div className={styles.internalLinks}>
                            <Link 
                                to={ROUTES.AUTH.getLogin(USER_ROLES.ADMIN)} 
                                className={styles.internalLink}
                            >
                                Kênh quản trị
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

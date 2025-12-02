import { Link } from 'react-router-dom';
import { Help, Notification } from '@/components/ui/icons';
import Cart from './Cart';
import { ROUTES } from '@/constants/route';
import { USER_ROLES } from '@/constants/role';
import styles from './MainHeader.module.css';

const MainHeader = () => {
    return (
        <header className={styles.mainHeader}>
            <div className='container mx-auto px-6'>
                <nav className='flex items-center justify-between'>
                    <ul className='flex items-center gap-1'>
                        <li className={styles.navbarTop__item}>
                            <Link to={ROUTES.AUTH.getLogin(USER_ROLES.OWNER)}>kênh chủ sân</Link>
                        </li>
                        <li className={styles.navbarTop__item}>
                            <Link to={ROUTES.AUTH.getRegister(USER_ROLES.OWNER)}>trở thành chủ sân</Link>
                        </li>
                        <li className={styles.navbarTop__item}><a href="">tải ứng dụng</a></li>
                    </ul>
                    <ul className='flex items-center gap-1'>
                        <li className={styles.navbarTop__item}>
                            <Link to="/">
                                <Notification />
                                <span>thông báo</span>
                            </Link>
                        </li>
                        <li className={styles.navbarTop__item}>
                            <a href="">
                                <Help />
                                <span>hỗ trợ</span>
                            </a>
                        </li>
                        <li className={styles.navbarTop__item}>
                            <Link to={ROUTES.AUTH.getRegister(USER_ROLES.PLAYER)}>đăng ký</Link>
                        </li>
                        <li className={styles.navbarTop__item}>
                            <Link to={ROUTES.AUTH.getLogin(USER_ROLES.PLAYER)}>đăng nhập</Link>
                        </li>
                    </ul>
                </nav>

                <nav className='flex items-center justify-between px-3 py-4'>
                    <div className='logo' style={{ width: '100px', height: '50px', backgroundColor: '#fff'}}></div>

                    <form></form>

                    <Cart />
                </nav>
            </div>
        </header>
    );
};

export default MainHeader;
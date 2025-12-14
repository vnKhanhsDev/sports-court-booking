import { Link } from 'react-router-dom';
import { Help, Notification } from '@/components/ui/icons';
import { ShoppingCart } from '@/components/ui/icons';
import { ROUTES } from '@/constants/route';
import { USER_ROLES } from '@/constants/role';
import UserAvatar from '@/layouts/shared/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import styles from './MainHeader.module.css';
import { useCallback } from 'react';

const MainHeader = () => {
    const { accessToken, activeRole, user, switchRole } = useAuth();
    const isAuthenticated = Boolean(accessToken);
    // Only show avatar for players, not for owners or admins
    const showAvatar = isAuthenticated && !!user && activeRole === USER_ROLES.PLAYER;
    const currentUser = user ?? { accountId: '', username: 'Khách', avatarUrl: '', roles: [] };

    const handleOwnerClick = useCallback((action: string) => {
        if (switchRole(USER_ROLES.OWNER)) {
            return ROUTES.OWNER.HOME;
        } else {
            if (action === 'login') return ROUTES.AUTH.getLogin(USER_ROLES.OWNER);
            return ROUTES.AUTH.getRegister(USER_ROLES.OWNER);
        }
    }, [user]);

    return (
        <header className={styles.mainHeader}>
            <div className='container mx-auto px-6'>
                <nav className='flex items-center justify-between'>
                    <ul className='flex items-center gap-1'>
                        <li className={styles.navbarTop__item}>
                            <Link to={handleOwnerClick('login')}>kênh chủ sân</Link>
                        </li>
                        <li className={styles.navbarTop__item}>
                            <Link to={handleOwnerClick('register')}>trở thành chủ sân</Link>
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
                        {showAvatar ? (
                            <li className={styles.navbarTop__item}>
                                <UserAvatar
                                    username={currentUser.username}
                                    subtitle=""
                                    avatarUrl={currentUser.avatarUrl}
                                    size="sm"
                                />
                            </li>
                        ) : (
                            <>
                                <li className={styles.navbarTop__item}>
                                    <Link to={ROUTES.AUTH.getRegister(USER_ROLES.PLAYER)}>đăng ký</Link>
                                </li>
                                <li className={styles.navbarTop__item}>
                                    <Link to={ROUTES.AUTH.getLogin(USER_ROLES.PLAYER)}>đăng nhập</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <nav className='flex items-center justify-between px-3 py-4'>
                    <div className='logo' style={{ width: '100px', height: '50px', backgroundColor: '#fff'}}></div>

                    <form></form>

                    <div className="flex items-center gap-3">
                        <ShoppingCart fontSize={35} />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default MainHeader;


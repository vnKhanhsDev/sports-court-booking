import { Outlet } from 'react-router-dom';
import MainHeader from './header/MainHeader';
import MainFooter from './footer/MainFooter';

const MainLayout = () => {
    return (
        <>
            <MainHeader />
            <main>
                <Outlet />
            </main>
            <MainFooter />
        </>
    );
};

export default MainLayout;
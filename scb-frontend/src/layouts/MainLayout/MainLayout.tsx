import { Outlet } from 'react-router-dom';
import { MainHeader, MainFooter } from '@components/layout/index';

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
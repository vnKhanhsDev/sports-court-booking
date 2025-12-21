import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout, AuthLayout, DashboardLayout } from '@layouts/index';
import { ROUTES } from '@constants/route';
import { RoleBasedGuard } from './RoleBasedGuard';
import { USER_ROLES } from '@/constants/role';

const HomePage = lazy(() => import('@features/public/home/HomePage'));
// const CourtSearchPage = lazy(() => import('@features/court/public/search/CourtSearchPage'));
const CourtSearchPage = lazy(() => import('@features/marketplace/pages/SearchPage'));
const CourtDetailPage = lazy(() => import('@features/court/public/detail/CourtDetailPage'));
const CourtBookingPage = lazy(() => import('@features/booking/public/CourtBookingPage'));
const PlayerBookingPage = lazy(() => import('@features/booking/player/PlayerBookingPage'));

const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));

const OwnerHomePage = lazy(() => import('@features/owner/home/OwnerHomePage'));
const OwnerCourtPage = lazy(() => import('@/features/court/pages/OwnerCourtPage'));
const PriceListPage = lazy(() => import('@/features/court/pages/PriceListPage'));
const OwnerBookingPage = lazy(() => import('@features/booking/owner/OwnerBookingPage'));

const AdminHomePage = lazy(() => import('@features/admin/home/AdminHomePage'));
const AdminCourtPage = lazy(() => import('@/features/court/pages/AdminCourtPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<RoleBasedGuard isPublic={true} />}>
            <Route path="/" element={<HomePage />} />
            <Route path={ROUTES.PUBLIC.COURTS.SEARCH} element={<CourtSearchPage />} />
            <Route path={ROUTES.PUBLIC.COURTS.DETAIL} element={<CourtDetailPage />} />
            <Route path={ROUTES.PUBLIC.COURTS.BOOK} element={<CourtBookingPage />} />
            <Route path={ROUTES.PUBLIC.RESERVATIONS} element={<PlayerBookingPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH.REGISTER_TEMPLATE} element={<RegisterPage />} />
          <Route path={ROUTES.AUTH.LOGIN_TEMPLATE} element={<LoginPage />} />
        </Route>

        <Route element={<RoleBasedGuard requiredRole={USER_ROLES.OWNER} />}>
          <Route element={<DashboardLayout role={USER_ROLES.OWNER} />}>
            <Route path={ROUTES.OWNER.HOME} element={<OwnerHomePage />} />
            <Route path={ROUTES.OWNER.COURT} element={<OwnerCourtPage />} />
            <Route path={ROUTES.OWNER.PRICE_LIST} element={<PriceListPage />} />
            <Route path={ROUTES.OWNER.BOOKING} element={<OwnerBookingPage />} />
          </Route>
        </Route>

        <Route element={<RoleBasedGuard requiredRole={USER_ROLES.ADMIN} />}>
          <Route element={<DashboardLayout role={USER_ROLES.ADMIN} />}>
            <Route path={ROUTES.ADMIN.HOME} element={<AdminHomePage />} />
            <Route path={ROUTES.ADMIN.COURTS} element={<AdminCourtPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
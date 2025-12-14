import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout, AuthLayout, DashboardLayout } from '@layouts/index';
import { ROUTES } from '@constants/route';
import { RoleBasedGuard } from './RoleBasedGuard';
import { USER_ROLES } from '@/constants/role';

const HomePage = lazy(() => import('@features/public/home/HomePage'));
const CourtSearchPage = lazy(() => import('@features/public/court/search/CourtSearchPage'));

const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));

const OwnerHomePage = lazy(() => import('@features/owner/home/OwnerHomePage'));
const CourtPageForOwner = lazy(() => import('@features/court/pages/CourtPageForOwner'));
const PriceTemplatePageForOwner = lazy(() => import('@features/court/pages/PriceTemplatePageForOwner'));
const OwnerBookingPage = lazy(() => import('@features/owner/booking/OwnerBookingPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<RoleBasedGuard isPublic={true} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courts" element={<CourtSearchPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH.REGISTER_TEMPLATE} element={<RegisterPage />} />
          <Route path={ROUTES.AUTH.LOGIN_TEMPLATE} element={<LoginPage />} />
        </Route>

        <Route element={<RoleBasedGuard requiredRole={USER_ROLES.OWNER} />}>
          <Route element={<DashboardLayout role={USER_ROLES.OWNER} />}>
            <Route path={ROUTES.OWNER.HOME} element={<OwnerHomePage />} />
            <Route path={ROUTES.OWNER.COURT} element={<CourtPageForOwner />} />
            <Route path={ROUTES.OWNER.PRICE_TEMPLATE} element={<PriceTemplatePageForOwner />} />
            <Route path={ROUTES.OWNER.BOOKING} element={<OwnerBookingPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
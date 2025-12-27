import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout, AuthLayout, DashboardLayout } from '@layouts/index';
import { ROUTES } from '@constants/route';
import { RoleBasedGuard } from './RoleBasedGuard';
import { USER_ROLES } from '@/constants/role';

const HomePage = lazy(() => import('@features/public/marketplace/pages/HomePage'));
const CourtSearchPage = lazy(() => import('@features/public/marketplace/pages/CourtSearchPage'));
const CourtDetailPage = lazy(() => import('@features/public/marketplace/pages/CourtDetailPage'));

const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));

const BookingCheckoutPage = lazy(() => import('@features/player/booking/pages/BookingCheckoutPage'));
const MyBookingPage = lazy(() => import('@features/player/booking/pages/MyBookingPage'));
const VNPayReturnPage = lazy(() => import('@features/payment/pages/VNPayReturnPage'));

const OwnerCourtPage = lazy(() => import('@/features/court/pages/OwnerCourtPage'));
const PriceListPage = lazy(() => import('@/features/court/pages/PriceListPage'));
const OwnerBookingPage = lazy(() => import('@/features/owner/court-manager/pages/BookingManagementPage'));

const AdminCourtPage = lazy(() => import('@/features/court/pages/AdminCourtPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<RoleBasedGuard isPublic={true} />}>
            <Route path={ROUTES.PUBLIC.MARKETPLACE.HOME} element={<HomePage />} />
            <Route path={ROUTES.PUBLIC.MARKETPLACE.SEARCH} element={<CourtSearchPage />} />
            <Route path={ROUTES.PUBLIC.MARKETPLACE.DETAIL} element={<CourtDetailPage />} />
            <Route path={ROUTES.PAYMENT.VNPAY_RETURN} element={<VNPayReturnPage />} />
          </Route>

          <Route element={<RoleBasedGuard requiredRole={USER_ROLES.PLAYER} />}>
            <Route path={ROUTES.PLAYER.BOOKING.CHECKOUT} element={<BookingCheckoutPage />} />
            <Route path={ROUTES.PLAYER.BOOKING.MY_BOOKINGS} element={<MyBookingPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH.REGISTER_TEMPLATE} element={<RegisterPage />} />
          <Route path={ROUTES.AUTH.LOGIN_TEMPLATE} element={<LoginPage />} />
        </Route>

        <Route element={<RoleBasedGuard requiredRole={USER_ROLES.OWNER} />}>
          <Route element={<DashboardLayout role={USER_ROLES.OWNER} />}>
            <Route path={ROUTES.OWNER.HOME} element={<div>Owner Home</div>} />
            <Route path={ROUTES.OWNER.COURT} element={<OwnerCourtPage />} />
            <Route path={ROUTES.OWNER.PRICE_LIST} element={<PriceListPage />} />
            <Route path={ROUTES.OWNER.BOOKING} element={<OwnerBookingPage />} />
          </Route>
        </Route>

        <Route element={<RoleBasedGuard requiredRole={USER_ROLES.ADMIN} />}>
          <Route element={<DashboardLayout role={USER_ROLES.ADMIN} />}>
            <Route path={ROUTES.ADMIN.HOME} element={<div>Admin Home</div>} />
            <Route path={ROUTES.ADMIN.COURTS} element={<AdminCourtPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
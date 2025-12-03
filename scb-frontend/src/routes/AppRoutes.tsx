import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout, AuthLayout } from '@layouts/index';
import { ROUTES } from '@constants/route';

const HomePage = lazy(() => import('@features/public/home/HomePage'));
const CourtSearchPage = lazy(() => import('@features/public/court/search/CourtSearchPage'));

const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courts" element={<CourtSearchPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH.REGISTER_TEMPLATE} element={<RegisterPage />} />
          <Route path={ROUTES.AUTH.LOGIN_TEMPLATE} element={<LoginPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
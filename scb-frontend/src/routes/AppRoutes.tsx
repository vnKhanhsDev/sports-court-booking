import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@layouts/index';

const HomePage = lazy(() => import('@features/public/home/HomePage'));
const CourtSearchPage = lazy(() => import('@features/public/court/search/CourtSearchPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courts" element={<CourtSearchPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
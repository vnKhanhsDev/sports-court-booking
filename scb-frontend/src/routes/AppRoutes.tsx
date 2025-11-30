import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Routes>
            
        </Routes>
    </Suspense>
  )
}

export default AppRoutes;
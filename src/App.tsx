import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LoadingScreen from './pages/LoadingScreen'
import useDB from './hooks/useDB'

const PropertiesPage = lazy(() => import('./pages/PropertiesPage'))
const PropertyFormPage = lazy(() => import('./pages/PropertyFormPage'))
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'))
const TenantFormPage = lazy(() => import('./pages/TenantFormPage'))
const TenantDetailPage = lazy(() => import('./pages/TenantDetailPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

export default function App() {
  const { dbReady } = useDB()

  if (!dbReady) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<PropertiesPage />} />
            <Route path="property/new" element={<PropertyFormPage />} />
            <Route path="property/:id" element={<PropertyDetailPage />} />
            <Route path="property/:id/edit" element={<PropertyFormPage />} />
            <Route path="property/:id/tenant/new" element={<TenantFormPage />} />
            <Route path="tenant/:id" element={<TenantDetailPage />} />
            <Route path="tenant/:id/edit" element={<TenantFormPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

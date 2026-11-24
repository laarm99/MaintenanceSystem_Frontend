import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LayoutApp from './layout/LayoutApp.jsx'
import LoginPage from './pages/login/LoginPage.jsx'
import ProtectedRouteComponent from './pages/login/ProtectedRouteComponent.jsx'
import AuthProvider from './pages/login/AuthProvider.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/dashboard/index.jsx'
import EquipmentPage from './pages/equipment/index.jsx'
import CalendarPage from './pages/calendar/index.jsx'
import MaintenancePage from './pages/maintenance/index.jsx'
import CatalogsPage from './pages/catalogs/index.jsx'
import ImportsPage from './pages/imports/index.jsx'
import { App } from 'antd'
import AppErrorBoundary from "./common/components/ErrorBoundary/AppErrorBoundary";
import "./i18n.js"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App>
      <AppErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route path="/" element={
                <ProtectedRouteComponent>
                  <LayoutApp />
                </ProtectedRouteComponent>
              } >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/equipment" element={<EquipmentPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/catalogs" element={<CatalogsPage />} />
                <Route path="/imports" element={<ImportsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AppErrorBoundary>
    </App>
  </StrictMode>,
)
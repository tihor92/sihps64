import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { CaseListPage } from './pages/CaseListPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { InstitutionsListPage } from './pages/InstitutionsListPage';
import { InstitutionProfilePage } from './pages/InstitutionProfilePage';
import { OverlapCenterPage } from './pages/OverlapCenterPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cases" element={<CaseListPage />} />
            <Route path="/cases/:caseId" element={<CaseDetailPage />} />
            <Route path="/institutions" element={<InstitutionsListPage />} />
            <Route path="/institutions/:aicteId" element={<InstitutionProfilePage />} />
            <Route path="/overlaps" element={<OverlapCenterPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;


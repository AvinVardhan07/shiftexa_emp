import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeStore from './pages/Employees/EmployeeStore';
import MyEmployees from './pages/Employees/MyEmployees';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import Leads from './pages/Leads/Leads';
import Calls from './pages/Calls/Calls';
import Campaigns from './pages/Campaigns/Campaigns';
import Integrations from './pages/Integrations/Integrations';
import Billing from './pages/Billing/Billing';
import Settings from './pages/Settings/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Customer Dashboard Application */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-employees/store" element={<EmployeeStore />} />
            <Route path="/ai-employees" element={<MyEmployees />} />
            <Route path="/ai-employees/:id" element={<EmployeeDetail />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Context & Components
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';
import ChatBot from './components/ChatBot';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import RecommendationPage from './pages/RecommendationPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import FinancialAdvicePage from './pages/FinancialAdvicePage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <NotificationToast />
        <ChatBot />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
          <Route path="/financial-advice" element={<FinancialAdvicePage />} />
          <Route path="/model-insights" element={<ModelInsightsPage />} />
          <Route path="/admin-panel" element={<AdminPanelPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;


import React, { useState, useEffect, useCallback } from 'react';
import { DashboardView } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './sections/DashboardHome';
import AIAssistant from './sections/AIAssistant';
import DietPlanner from './sections/DietPlanner';
import ECGAnalysis from './sections/ECGAnalysis';
import AIReportSummariser from './sections/AISummariser';
import Auth from './components/Auth';
import VoiceAssistant from './components/VoiceAssistant';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<DashboardView>(DashboardView.Home);

  useEffect(() => {
    // Check for an active session on initial load
    const sessionActive = sessionStorage.getItem('cardiac_care_session') === 'true';
    if (sessionActive) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem('cardiac_care_session', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cardiac_care_session');
    setIsAuthenticated(false);
    setCurrentView(DashboardView.Home); // Reset view on logout
  };

  const navigateTo = useCallback((view: DashboardView) => {
    setCurrentView(view);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case DashboardView.Home:
        return <DashboardHome navigateTo={navigateTo} />;
      case DashboardView.AIAssistant:
        return <AIAssistant />;
      case DashboardView.DietPlanner:
        return <DietPlanner />;
      case DashboardView.ECGAnalysis:
        return <ECGAnalysis />;
      case DashboardView.AIReportSummariser:
        return <AIReportSummariser />;
      default:
        return <DashboardHome navigateTo={navigateTo} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={navigateTo} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
      <VoiceAssistant navigateTo={navigateTo} />
    </div>
  );
};

export default App;

import React from 'react';
import { DashboardView } from '../types';

interface HeaderProps {
  currentView: DashboardView;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  return (
    <header className="h-20 bg-gray-900/50 backdrop-blur-sm flex items-center px-6 md:px-8 border-b border-gray-700">
      <h1 className="text-2xl font-semibold text-white">{currentView}</h1>
    </header>
  );
};

export default Header;

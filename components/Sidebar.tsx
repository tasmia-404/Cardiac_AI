
import React from 'react';
import { DashboardView } from '../types';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  onLogout: () => void;
}

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <aside className="w-16 md:w-64 bg-gray-900 text-gray-300 flex flex-col transition-all duration-300">
      <div className="flex items-center justify-center md:justify-start md:pl-6 h-20 border-b border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h1 className="hidden md:block text-xl font-bold ml-2 text-white">Cardiac Care</h1>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-4 space-y-2">
        {NAV_ITEMS.map(item => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView(item.name);
            }}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 justify-center md:justify-start ${
              currentView === item.name
                ? 'bg-red-500/20 text-red-400'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            aria-current={currentView === item.name ? 'page' : undefined}
          >
            {item.icon}
            <span className="hidden md:inline ml-4 font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="p-2 md:p-4 border-t border-gray-700">
        <button
            onClick={onLogout}
            className="flex items-center p-3 rounded-lg transition-colors duration-200 justify-center md:justify-start w-full text-gray-400 hover:bg-gray-700 hover:text-white"
        >
            <LogoutIcon />
            <span className="hidden md:inline ml-4 font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

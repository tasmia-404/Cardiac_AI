
import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 cursor-pointer transform hover:scale-105 hover:bg-gray-700/70 transition-all duration-300 group shadow-lg hover:shadow-red-500/20"
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-700 group-hover:bg-red-500 text-red-400 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  );
};

export default DashboardCard;

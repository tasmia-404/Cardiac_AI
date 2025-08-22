
import React from 'react';
import { DashboardView } from '../types';
import DashboardCard from '../components/DashboardCard';
import { NAV_ITEMS } from '../constants';

interface DashboardHomeProps {
  navigateTo: (view: DashboardView) => void;
}

const descriptions: Record<string, string> = {
    [DashboardView.AIAssistant]: "Ask questions about heart diseases based on our provided medical knowledge base.",
    [DashboardView.DietPlanner]: "Generate personalized 7-day Indian diet plans for specific cardiac conditions.",
    [DashboardView.ECGAnalysis]: "Get an AI-powered preliminary analysis of your ECG data.",
    [DashboardView.AIReportSummariser]: "Summarize, explain, and highlight key medical terms from complex reports."
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ navigateTo }) => {
  const cards = NAV_ITEMS.filter(item => item.name !== DashboardView.Home);
  
  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-2">Welcome to Cardiac Care</h2>
        <p className="text-gray-400 mb-8">Your AI-powered assistant for heart health.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map(item => (
                 <DashboardCard 
                    key={item.name}
                    icon={item.icon}
                    title={item.name}
                    description={descriptions[item.name]}
                    onClick={() => navigateTo(item.name)}
                 />
            ))}
        </div>
    </div>
  );
};

export default DashboardHome;
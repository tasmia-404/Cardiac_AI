import React from 'react';

export enum DashboardView {
  Home = 'Dashboard',
  AIAssistant = 'Cardiac AI Assistant',
  DietPlanner = 'Cardiac Diet Planner',
  ECGAnalysis = 'ECG Analysis',
  AIReportSummariser = 'AI Report Summarizer',
}

export interface NavItem {
  name: DashboardView;
  icon: React.ReactNode;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Meal {
    name: string;
    description: string;
    calories: number;
}

export interface DayPlan {
    meals: Meal[];
    dailyCalories: number;
}

export type DietPlan = Record<DayOfWeek, DayPlan>;

export interface MedicalTerm {
    term: string;
    definition: string;
}

export interface ReportSummary {
    summary: string;
    medicalTerms: MedicalTerm[];
    explanation: string;
}
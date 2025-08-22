
import React from 'react';
import { DashboardView, NavItem } from './types';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const AssistantIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const DietIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 01-1.414 1.414L12 6.414l-2.293 2.293a1 1 0 01-1.414-1.414L10 4.414l2-2zM12 12a2 2 0 100 4 2 2 0 000-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const EcgIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h.01M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M21 10h.01M3 14h.01M6 14h.01M9 14h.01M12 14h.01M15 14h.01M18 14h.01M21 14h.01" />
    </svg>
);

const SummariserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


export const NAV_ITEMS: NavItem[] = [
  { name: DashboardView.Home, icon: <HomeIcon /> },
  { name: DashboardView.AIAssistant, icon: <AssistantIcon /> },
  { name: DashboardView.DietPlanner, icon: <DietIcon /> },
  { name: DashboardView.ECGAnalysis, icon: <EcgIcon /> },
  { name: DashboardView.AIReportSummariser, icon: <SummariserIcon /> },
];

export const CARDIAC_CONDITIONS_AND_SURGERIES = {
    'Heart Diseases (Cardiac Conditions)': [
        'Coronary Artery Disease (CAD) / Ischemic Heart Disease',
        'Angina Pectoris (Stable, Unstable, Variant)',
        'Myocardial Infarction (Heart Attack)',
        'Silent Ischemia',
        'Congestive Heart Failure (CHF)',
        'Left-sided Heart Failure',
        'Right-sided Heart Failure',
        'Diastolic Dysfunction',
        'Cardiomyopathy (Dilated, Hypertrophic, Restrictive)',
        'Aortic Stenosis',
        'Aortic Regurgitation',
        'Mitral Stenosis',
        'Mitral Regurgitation',
        'Mitral Valve Prolapse',
        'Tricuspid Valve Disease',
        'Pulmonic Valve Disease',
        'Atrial Fibrillation (AFib)',
        'Atrial Flutter',
        'Supraventricular Tachycardia (SVT)',
        'Ventricular Tachycardia (VT)',
        'Ventricular Fibrillation (VFib)',
        'Bradycardia',
        'Heart Block (1st, 2nd, 3rd degree)',
        'Long QT Syndrome',
        'Sick Sinus Syndrome',
        'Atrial Septal Defect (ASD)',
        'Ventricular Septal Defect (VSD)',
        'Patent Ductus Arteriosus (PDA)',
        'Tetralogy of Fallot (TOF)',
        'Transposition of Great Arteries (TGA)',
        'Coarctation of Aorta',
        'Hypoplastic Left Heart Syndrome',
        'Truncus Arteriosus',
        "Ebstein's Anomaly",
        'Hypertension (High Blood Pressure)',
        'Pulmonary Hypertension',
        'Peripheral Artery Disease (PAD)',
        'Aortic Aneurysm (Thoracic/Abdominal)',
        'Aortic Dissection',
        'Pericarditis',
        'Myocarditis',
        'Endocarditis (Infective, Non-infective)',
        'Rheumatic Heart Disease',
        'Syncope (cardiac origin)',
        'Sudden Cardiac Arrest',
        'Cardiac Tamponade',
        'Hypertensive Heart Disease'
    ],
    'Cardiac Surgeries & Interventions': [
        'Coronary Artery Bypass Grafting (CABG)',
        'Off-pump CABG',
        'Minimally Invasive Direct CABG (MIDCAB)',
        'Angioplasty & Stenting (PCI)',
        'Aortic Valve Replacement (AVR)',
        'Mitral Valve Replacement (MVR)',
        'Tricuspid Valve Replacement',
        'Pulmonic Valve Surgery',
        'Valve Repair',
        'Transcatheter Valve Replacement (TAVR/TAVI, TMVR)',
        'Pacemaker Implantation',
        'Implantable Cardioverter Defibrillator (ICD)',
        'Cardiac Resynchronization Therapy (CRT)',
        'Catheter Ablation',
        'Maze Procedure',
        'ASD Closure',
        'VSD Repair',
        'PDA Ligation/Closure',
        'Tetralogy of Fallot Repair',
        'Arterial Switch Operation',
        'Fontan Procedure',
        'Norwood Procedure',
        'Rastelli Procedure',
        'Balloon Septostomy',
        'Aortic Aneurysm Repair (Open/EVAR/TEVAR)',
        'Aortic Dissection Repair',
        'Carotid Endarterectomy',
        'Left Ventricular Assist Device (LVAD) Implantation',
        'Total Artificial Heart (TAH)',
        'Heart Transplantation',
        'Pericardiectomy',
        'Pericardial Window'
    ]
};
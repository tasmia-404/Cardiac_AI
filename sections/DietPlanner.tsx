
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { DietPlan, DayOfWeek } from '../types';
import Spinner from '../components/Spinner';
import { CARDIAC_CONDITIONS_AND_SURGERIES } from '../constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const DietPlanner: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '30',
    weight: '70',
    height: '175',
    gender: 'male',
    activityLevel: 'moderately_active',
    cardiacCondition: 'Coronary Artery Disease (CAD) / Ischemic Heart Disease',
    preferences: ''
  });
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DayOfWeek>('Monday');

  const planRef = useRef<HTMLDivElement>(null);
  const fullPlanRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const generatedPlan = await geminiService.generateDietPlan(formData);
      setPlan(generatedPlan);
      setActiveTab('Monday');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate diet plan: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportPDF = () => {
    if (!fullPlanRef.current || !plan) return;

    const input = fullPlanRef.current;
    html2canvas(input, {
        scale: 2,
        backgroundColor: '#1f2937' // gray-800
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const pdfHeight = pdfWidth / ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Cardiac_Diet_Plan_${formData.cardiacCondition.replace(/[\s/]/g, '_')}.pdf`);
    });
  };

  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-lg h-fit">
        <h2 className="text-2xl font-bold mb-4 text-white">Cardiac Diet Planner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Gender</label>
                 <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-300">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500" required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500" required/>
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-300">Activity Level</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500">
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
              </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Cardiac Condition / Surgery</label>
            <select name="cardiacCondition" value={formData.cardiacCondition} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500">
              {Object.entries(CARDIAC_CONDITIONS_AND_SURGERIES).map(([group, conditions]) => (
                <optgroup label={group} key={group}>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Preferences/Allergies (e.g., vegetarian, no nuts)</label>
            <textarea name="preferences" value={formData.preferences} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"></textarea>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center">
            {isLoading ? <Spinner /> : 'Generate 7-Day Indian Plan'}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-white">Your 7-Day Diet Plan</h2>
            {plan && (
                 <button onClick={handleExportPDF} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Export to PDF
                </button>
            )}
        </div>

        {isLoading && <div className="flex justify-center items-center h-full min-h-64"><Spinner /></div>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        
        {plan && (
            <div className="animate-fade-in" ref={planRef}>
                <div className="border-b border-gray-600 mb-4">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                        {daysOfWeek.map(day => (
                            <button
                                key={day}
                                onClick={() => setActiveTab(day)}
                                className={`${
                                    activeTab === day
                                        ? 'border-red-400 text-red-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                            >
                                {day}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div>
                  {daysOfWeek.map(day => (
                      <div key={day} style={{ display: activeTab === day ? 'block' : 'none' }}>
                          <div className="bg-gray-700 p-4 rounded-lg text-center mb-4">
                              <p className="text-gray-300">Estimated Daily Calories for {day}</p>
                              <p className="text-3xl font-bold text-red-400">{plan[day].dailyCalories} kcal</p>
                          </div>
                          <div className="space-y-4">
                              {plan[day].meals.map((meal, index) => (
                                  <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                                      <h3 className="text-lg font-semibold text-red-400">{meal.name} <span className="text-sm font-normal text-gray-400">({meal.calories} kcal)</span></h3>
                                      <p className="text-gray-300 mt-1">{meal.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
                </div>
            </div>
        )}
        
        {/* Hidden div for PDF export that contains the full plan */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px'}} >
          <div ref={fullPlanRef}>
              {plan && daysOfWeek.map(day => (
                  <div key={`${day}-pdf`} className="p-4 bg-gray-800 text-gray-100">
                      <h3 className="text-2xl font-bold text-red-400 mb-2 border-b border-gray-600 pb-2">{day}</h3>
                      <div className="bg-gray-700 p-4 rounded-lg text-center mb-4">
                          <p className="text-gray-300">Estimated Daily Calories</p>
                          <p className="text-3xl font-bold text-red-400">{plan[day].dailyCalories} kcal</p>
                      </div>
                      <div className="space-y-4">
                          {plan[day].meals.map((meal, index) => (
                              <div key={`${index}-pdf`} className="bg-gray-700/50 p-4 rounded-lg">
                                  <h4 className="text-lg font-semibold text-red-400">{meal.name} <span className="text-sm font-normal text-gray-400">({meal.calories} kcal)</span></h4>
                                  <p className="text-gray-300 mt-1">{meal.description}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
        </div>


        {!plan && !isLoading && !error && <p className="text-gray-400 text-center mt-8">Your personalized 7-day diet plan will appear here once generated.</p>}
      </div>
    </div>
  );
};

export default DietPlanner;

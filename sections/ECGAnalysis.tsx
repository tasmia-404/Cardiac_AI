
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import Spinner from '../components/Spinner';

const ECGAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File is too large. Please select a file smaller than 4MB.");
        return;
      }
      setFile(selectedFile);
      setAnalysis(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image file first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      if (!preview) throw new Error("File preview not available.");
      const base64Data = preview.split(',')[1];
      const result = await geminiService.analyzeECG(base64Data, file.type);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-white">ECG Analysis</h2>
        <p className="text-gray-400 mb-4">Upload an image of an ECG reading for an AI-powered analysis. This is a demonstrative tool and not for medical diagnosis.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label htmlFor="ecg-upload" className="flex-1 w-full sm:w-auto cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-center">
            {file ? `Selected: ${file.name}` : 'Select ECG Image'}
          </label>
          <input id="ecg-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
          <button onClick={handleAnalyze} disabled={!file || isLoading} className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center">
            {isLoading ? <Spinner /> : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Image Preview</h3>
          <div className="flex items-center justify-center h-64 bg-gray-700/50 rounded-lg">
            {preview ? <img src={preview} alt="ECG Preview" className="max-h-full max-w-full object-contain" /> : <p className="text-gray-500">No image selected</p>}
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Analysis Result</h3>
          <div className="h-64 overflow-y-auto p-2 bg-gray-700/50 rounded-lg">
            {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
            {analysis ? <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p> : !isLoading && <p className="text-gray-500">Analysis will appear here.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGAnalysis;

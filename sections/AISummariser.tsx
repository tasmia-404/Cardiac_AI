
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { ReportSummary } from '../types';

type InputMode = 'text' | 'file';

const AIReportSummariser: React.FC = () => {
  const [mode, setMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // dataURL for both image preview and file sending
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 4MB limit
      if (selectedFile.size > 4 * 1024 * 1024) {
        setError('File is too large. Please select a file smaller than 4MB.');
        return;
      }
      setError(null);
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      let result;
      if (mode === 'text') {
        if (!text.trim()) {
          setError("Please enter some text to summarize.");
          setIsLoading(false);
          return;
        }
        result = await geminiService.summarizeReport(text);
      } else {
        if (!file || !filePreview) {
          setError("Please select a file to analyze.");
          setIsLoading(false);
          return;
        }
        const base64Data = filePreview.split(',')[1];
        result = await geminiService.summarizeReportFromFile(base64Data, file.type);
      }
      setSummary(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAnalyzeDisabled = isLoading || (mode === 'text' && !text.trim()) || (mode === 'file' && !file);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">AI Report Summarizer</h2>
        <p className="text-gray-400 mb-6">Upload an image/PDF or paste a medical report to receive a summary, explanation, and a list of key terms.</p>
        
        <div className="border-b border-gray-600 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => setMode('text')}
                    className={`${
                        mode === 'text'
                            ? 'border-red-400 text-red-400'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors focus:outline-none`}
                >
                    Paste Text
                </button>
                <button
                    onClick={() => setMode('file')}
                    className={`${
                        mode === 'file'
                            ? 'border-red-400 text-red-400'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors focus:outline-none`}
                >
                    Upload File
                </button>
            </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label htmlFor="input-area" className="block text-lg font-semibold text-gray-300 mb-2">Input</label>
            {mode === 'text' ? (
              <textarea
                id="input-area"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your report here..."
                className="w-full h-80 bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            ) : (
              <div className="w-full h-80 bg-gray-700 border-2 border-dashed border-gray-600 rounded-md p-3 flex flex-col items-center justify-center text-center">
                 <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" />
                {filePreview ? (
                    <div className="h-full flex flex-col justify-center items-center">
                      {file?.type.startsWith('image/') ? (
                         <img src={filePreview} alt="Report Preview" className="max-h-48 max-w-full object-contain rounded-md mb-2"/>
                      ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                         </svg>
                      )}
                      <p className="text-gray-300 font-semibold truncate max-w-full px-2">{file?.name}</p>
                      <button onClick={() => { setFile(null); setFilePreview(null); }} className="text-sm text-red-400 hover:underline mt-2">Change file</button>
                    </div>
                ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <label htmlFor="file-upload" className="mt-2 font-semibold text-red-400 cursor-pointer hover:text-red-500 transition-colors">
                        Choose a file
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF up to 4MB</p>
                    </>
                )}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="summary-output" className="block text-lg font-semibold text-gray-300 mb-2">Analysis</label>
            <div id="summary-output" className="w-full h-80 bg-gray-900 border-gray-700 rounded-md p-3 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full"><Spinner /></div>
              ) : summary ? (
                <div className="space-y-6 text-gray-300 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 border-b border-gray-600 pb-1 mb-2">Summary</h3>
                    <p className="whitespace-pre-wrap text-sm">{summary.summary}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 border-b border-gray-600 pb-1 mb-2">Explanation of Report</h3>
                    <p className="whitespace-pre-wrap text-sm">{summary.explanation}</p>
                  </div>
                   <div>
                    <h3 className="text-lg font-semibold text-red-400 border-b border-gray-600 pb-1 mb-2">Key Medical Terms</h3>
                    <ul className="space-y-2">
                      {summary.medicalTerms.map((item, index) => (
                        <li key={index} className="text-sm">
                          <strong className="text-gray-100">{item.term}:</strong> {item.definition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 h-full flex items-center justify-center">Your report analysis will appear here.</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={handleAnalyze} disabled={isAnalyzeDisabled} className="w-full bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center">
             {isLoading ? <Spinner /> : 'Analyze Report'}
          </button>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AIReportSummariser;

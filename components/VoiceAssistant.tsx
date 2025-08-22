
import React, { useState, useEffect, useRef } from 'react';
import { DashboardView } from '../types';

// --- Type definitions for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}
// --- End of Type Definitions ---

interface VoiceAssistantProps {
  navigateTo: (view: DashboardView) => void;
}

// For cross-browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ navigateTo }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    
    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      speak("Sorry, I encountered an error.");
    };

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      handleCommand(command);
    };

    recognitionRef.current = recognition;
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (command: string) => {
    let view: DashboardView | null = null;
    let feedback: string | null = null;

    if (command.includes('home') || command.includes('dashboard')) {
        view = DashboardView.Home;
        feedback = 'Navigating to the dashboard.';
    } else if (command.includes('cardiac assistant') || command.includes('ai assistant')) {
        view = DashboardView.AIAssistant;
        feedback = 'Opening the Cardiac AI Assistant.';
    } else if (command.includes('diet plan') || command.includes('diet planner')) {
        view = DashboardView.DietPlanner;
        feedback = 'Opening the Cardiac Diet Planner.';
    } else if (command.includes('ecg') || command.includes('e.c.g.') || command.includes('analysis')) {
        view = DashboardView.ECGAnalysis;
        feedback = 'Opening ECG Analysis.';
    } else if (command.includes('report summarizer') || command.includes('summarize report')) {
        view = DashboardView.AIReportSummariser;
        feedback = 'Opening the AI Report Summarizer.';
    }

    if (view && feedback) {
        speak(feedback);
        navigateTo(view);
    } else {
        speak("Sorry, I didn't understand that command. Please try again.");
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch(e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  if (!SpeechRecognition) {
    return null; // Don't render the button if the API is not supported
  }

  return (
    <button
      onClick={toggleListening}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 h-16 w-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 z-50 ${isListening ? 'bg-green-500' : 'bg-red-500 hover:bg-red-600'}`}
      aria-label="Toggle Voice Assistant"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
            <path d="M5.5 11.5a4.5 4.5 0 009 0H16a6 6 0 01-3.13 5.416V19h1.63a.5.5 0 010 1H5.5a.5.5 0 010-1H7.13v-2.084A6 6 0 014 11.5h1.5z" />
        </svg>
      {isListening && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
    </button>
  );
};

export default VoiceAssistant;

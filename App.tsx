import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { TripForm } from './components/TripForm';
import { AppState, TripFormData } from './types';
import { AlertCircle, CheckCircle, ArrowLeft, MapPin, Calendar, Wallet, Sun, Star, Clock } from 'lucide-react';

// --- Types for the Parsed Response ---
interface ParsedDay {
  title: string;
  activities: string[];
}

interface ParsedItinerary {
  destination: string;
  duration: string;
  budget: string;
  days: ParsedDay[];
  rawText: string;
}

// --- Helper Functions ---

/**
 * Parses the raw text response into a structured object for the UI.
 */
const parseItineraryText = (text: string): ParsedItinerary => {
  const result: ParsedItinerary = {
    destination: '',
    duration: '',
    budget: '',
    days: [],
    rawText: text
  };

  if (!text) return result;

  // Split into Meta section and Itinerary section
  const parts = text.split(/Itinerary:/i);
  const metaPart = parts[0];
  // Rejoin the rest in case "Itinerary:" appears multiple times (unlikely but safe)
  const itineraryPart = parts.length > 1 ? parts.slice(1).join('Itinerary:') : '';

  // 1. Parse Meta Data
  const metaLines = metaPart.split('\n');
  metaLines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine.match(/^Destination:/i)) {
      result.destination = cleanLine.replace(/^Destination:/i, '').trim();
    } else if (cleanLine.match(/^Number of Days:/i)) {
      result.duration = cleanLine.replace(/^Number of Days:/i, '').trim();
    } else if (cleanLine.match(/^Total Budget:/i)) {
      result.budget = cleanLine.replace(/^Total Budget:/i, '').trim();
    }
  });

  // 2. Parse Days using a regex to identify Day headers
  // This matches "Day 1", "Day 1:", "**Day 1**", etc.
  const dayHeaderRegex = /(?:^|\n)(?:\*\*)?Day\s+\d+.*?(?=\n|$)/gi;
  
  const dayMatches = itineraryPart.match(dayHeaderRegex);
  const dayContents = itineraryPart.split(dayHeaderRegex);

  // The split usually results in an empty string or preamble at index 0.
  // dayMatches[0] corresponds to the header for dayContents[1]
  
  if (dayMatches && dayContents.length > 1) {
    dayMatches.forEach((header, idx) => {
      const content = dayContents[idx + 1]; // +1 because split starts with pre-match
      if (!content) return;

      // Clean Title (remove markdown bold chars and trailing colons)
      const cleanTitle = header.trim().replace(/\*/g, '').replace(/:$/, '');

      // Parse Activities line by line for safety
      const activities: string[] = [];
      const lines = content.split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        // Check for bullet points (*, -, or •)
        if (trimmed.match(/^[\*\-\•]\s+/)) {
          // Remove the bullet and trim
          activities.push(trimmed.replace(/^[\*\-\•]\s+/, ''));
        }
      });

      if (activities.length > 0) {
        result.days.push({
          title: cleanTitle,
          activities: activities
        });
      }
    });
  }

  return result;
};

// --- Components ---

const FormattedText: React.FC<{ text: string, className?: string }> = ({ text, className = "" }) => {
  if (!text) return null;

  // Render bold text segment (e.g., **Morning:**)
  // We split by the bold markdown syntax
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Remove the stars and render bold
          return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const [parsedData, setParsedData] = useState<ParsedItinerary | null>(null);

  const handleFormSubmit = async (formData: TripFormData) => {
    setState({ status: 'loading', data: null, error: null });
    setParsedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await fetch('http://localhost:5678/webhook-test/e4b72ae1-e9e8-4334-923f-779e11ae1cad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const json = await response.json();
      
      let outputText = "";
      if (Array.isArray(json) && json.length > 0 && json[0].output) {
        outputText = json[0].output;
      } else if (typeof json === 'object' && json.output) {
         outputText = json.output;
      } else {
        // Fallback: try to dump the whole json if structure matches
        outputText = JSON.stringify(json, null, 2);
      }

      // Parse the text immediately
      const parsed = parseItineraryText(outputText);
      
      setParsedData(parsed);
      setState({ status: 'success', data: outputText, error: null });

    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setState({ status: 'error', data: null, error: message });
    }
  };

  const handleReset = () => {
    setState({ status: 'idle', data: null, error: null });
    setParsedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Hero />

      <main className="flex-grow pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Form Section */}
          {state.status !== 'success' && (
            <TripForm onSubmit={handleFormSubmit} isLoading={state.status === 'loading'} />
          )}

          {/* Error State */}
          {state.status === 'error' && (
            <div className="mt-12 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4 animate-fadeIn">
              <div className="p-2 bg-red-100 rounded-full text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Submission Failed</h3>
                <p className="text-red-700">{state.error}</p>
                <button 
                  onClick={() => setState(prev => ({ ...prev, status: 'idle', error: null }))}
                  className="mt-4 text-sm font-semibold text-red-700 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Success State - Card View */}
          {state.status === 'success' && parsedData && (
            <div className="mt-8 animate-fadeIn space-y-8">
              
              {/* Trip Header Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-700 opacity-95"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center"></div>
                
                <div className="relative z-10 px-8 py-10 md:py-14 text-white">
                   <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-white/30 shadow-sm">
                      <CheckCircle className="w-3 h-3 text-brand-200" /> Trip Ready
                   </div>
                   
                   <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 drop-shadow-md">
                      {parsedData.destination || "Your Itinerary"}
                   </h2>
                   
                   <div className="flex flex-wrap gap-x-8 gap-y-4 text-brand-50 mt-6">
                      {parsedData.duration && (
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                          <Calendar className="w-5 h-5 text-brand-200" />
                          <span className="font-medium text-lg">{parsedData.duration}</span>
                        </div>
                      )}
                      {parsedData.budget && (
                         <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                          <Wallet className="w-5 h-5 text-brand-200" />
                          <span className="font-medium text-lg max-w-lg truncate">{parsedData.budget}</span>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Day Cards List */}
              {parsedData.days.length > 0 ? (
                <div className="grid gap-6">
                  {parsedData.days.map((day, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      
                      {/* Day Header */}
                      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm">
                             {idx + 1}
                           </span>
                           <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                             {day.title}
                           </h3>
                        </div>
                        <Sun className="hidden md:block w-5 h-5 text-slate-300" />
                      </div>
                      
                      {/* Activities List */}
                      <div className="p-6 md:p-8">
                        <ul className="space-y-6">
                          {day.activities.map((activity, actIdx) => (
                            <li key={actIdx} className="flex gap-4 group">
                              <div className="flex-shrink-0 mt-1">
                                <Clock className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                              </div>
                              <div className="flex-grow text-slate-600 leading-relaxed">
                                <FormattedText text={activity} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Fallback for parsing failure
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Itinerary Details</h3>
                  <div className="whitespace-pre-wrap text-slate-600 leading-relaxed font-mono text-sm bg-slate-50 p-6 rounded-xl border border-slate-200">
                     {parsedData.rawText}
                  </div>
                </div>
              )}

              {/* Footer Action */}
              <div className="flex justify-center pt-8 pb-12">
                <button
                  onClick={handleReset}
                  className="group flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Plan Another Trip
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Wanderlust Planner. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
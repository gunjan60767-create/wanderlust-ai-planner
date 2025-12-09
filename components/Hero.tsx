import React from 'react';
import { Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-slate-900 text-white pt-24 pb-32 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
            <Compass className="w-8 h-8 text-brand-500" />
          </div>
          <span className="text-sm font-semibold tracking-wider uppercase text-brand-100">Travel Planner</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6">
          Your Next Adventure, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-300">
            Starts Here.
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10">
          Enter your destination, dates, and preferences below to request your personalized travel itinerary.
        </p>
      </div>
    </div>
  );
};
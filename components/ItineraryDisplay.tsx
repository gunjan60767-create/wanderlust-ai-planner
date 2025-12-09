import React, { useState } from 'react';
import { Itinerary, Activity, ActivityType } from '../types';
import { Clock, MapPin, Camera, Utensils, Coffee, Sun, Moon, Banknote, Star } from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onReset: () => void;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case ActivityType.FOOD: return <Utensils className="w-4 h-4" />;
    case ActivityType.SIGHTSEEING: return <Camera className="w-4 h-4" />;
    case ActivityType.RELAX: return <Coffee className="w-4 h-4" />;
    case ActivityType.ADVENTURE: return <Sun className="w-4 h-4" />;
    case ActivityType.CULTURE: return <Star className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case ActivityType.FOOD: return 'bg-orange-100 text-orange-600 border-orange-200';
    case ActivityType.SIGHTSEEING: return 'bg-blue-100 text-blue-600 border-blue-200';
    case ActivityType.RELAX: return 'bg-teal-100 text-teal-600 border-teal-200';
    case ActivityType.ADVENTURE: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case ActivityType.CULTURE: return 'bg-purple-100 text-purple-600 border-purple-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onReset }) => {
  const [activeDay, setActiveDay] = useState<number>(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-4">
          <Banknote className="w-4 h-4 mr-2" />
          Est. Cost: {itinerary.totalEstimatedCost}
        </div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">{itinerary.tripTitle}</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {itinerary.destinationSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Day Navigation (Sticky on Desktop) */}
        <div className="lg:col-span-3">
          <div className="sticky top-8 space-y-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Itinerary Days</h3>
            {itinerary.dailyPlans.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group
                  ${activeDay === day.dayNumber 
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                    : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="flex flex-col">
                  <span className={`text-xs font-medium opacity-80 ${activeDay === day.dayNumber ? 'text-brand-100' : 'text-slate-400'}`}>
                    Day {day.dayNumber}
                  </span>
                  <span className="font-semibold text-sm truncate">{day.date}</span>
                </div>
                {activeDay === day.dayNumber && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </button>
            ))}
            
            <button 
              onClick={onReset}
              className="mt-8 w-full py-3 px-4 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Plan New Trip
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="lg:col-span-9 space-y-8">
          {itinerary.dailyPlans.map((day) => (
            <div 
              key={day.dayNumber} 
              className={`${activeDay === day.dayNumber ? 'block' : 'hidden lg:block'} scroll-mt-24`}
              id={`day-${day.dayNumber}`}
            >
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Day Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-sans">
                        {day.dayNumber}
                      </span>
                      {day.theme}
                    </h3>
                    <p className="text-slate-500 mt-1 ml-11">{day.date}</p>
                  </div>
                </div>

                {/* Activities Timeline */}
                <div className="p-8">
                  <div className="relative border-l-2 border-slate-100 ml-4 space-y-12 last:pb-0">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="relative pl-10 group">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${getActivityColor(activity.type).split(' ')[0].replace('bg-', 'bg-')}`}></div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                          {/* Time & Type */}
                          <div className="sm:w-32 flex-shrink-0 pt-1">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">{activity.time}</span>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                              <span className="ml-1.5 capitalize">{activity.type}</span>
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-grow bg-slate-50/50 p-5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                                {activity.title}
                              </h4>
                            </div>
                            
                            <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                              {activity.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                <MapPin className="w-3 h-3 text-brand-500" />
                                {activity.location}
                              </div>
                              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                <Banknote className="w-3 h-3 text-green-600" />
                                {activity.costEstimate}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
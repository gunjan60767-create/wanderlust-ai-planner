import React, { useState } from 'react';
import { TripFormData } from '../types';
import { Calendar, Users, MapPin, Wallet, Send } from 'lucide-react';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    guests: 2,
    budget: 'moderate'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate min end date based on start date
  const minEndDate = formData.startDate ? formData.startDate : undefined;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-20 relative z-20 max-w-4xl mx-auto border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Destination */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Where to?</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Kyoto, Japan"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow outline-none"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Check-in</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Check-out</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="date"
                name="endDate"
                required
                min={minEndDate}
                value={formData.endDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-600"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Travelers</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                name="guests"
                min="1"
                max="20"
                required
                value={formData.guests}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Budget Style</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Wallet className="h-5 w-5 text-slate-400" />
              </div>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white appearance-none"
              >
                <option value="budget">Budget-Friendly</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
          
           {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 pt-2 md:pt-8 lg:pt-8 flex items-end">
             <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 
                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/25 hover:-translate-y-0.5 active:translate-y-0'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Trip Request
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  guests: number;
  budget: 'budget' | 'moderate' | 'luxury';
}

export enum ActivityType {
  SIGHTSEEING = 'sightseeing',
  FOOD = 'food',
  RELAX = 'relax',
  ADVENTURE = 'adventure',
  CULTURE = 'culture'
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  type: ActivityType;
  costEstimate: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  tripTitle: string;
  destinationSummary: string;
  totalEstimatedCost: string;
  dailyPlans: DayPlan[];
}

export interface AppState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: string | null;
  error: string | null;
}
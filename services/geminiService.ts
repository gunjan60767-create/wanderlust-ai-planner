import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary, TripFormData } from "../types";

// Helper to calculate days between dates
const getDaysDiff = (start: string, end: string) => {
  const date1 = new Date(start);
  const date2 = new Date(end);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
};

export const generateItinerary = async (formData: TripFormData): Promise<Itinerary> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const numDays = getDaysDiff(formData.startDate, formData.endDate);
  
  const prompt = `
    Create a detailed ${numDays}-day travel itinerary for ${formData.guests} people to ${formData.destination}.
    The trip starts on ${formData.startDate} and ends on ${formData.endDate}.
    The budget style is ${formData.budget}.
    
    For each day, provide a theme and a list of activities including meals, sightseeing, and relaxation.
    Include specific location names, estimated costs, and a brief description of what to do.
    Make it realistic with travel times considered.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tripTitle: { type: Type.STRING, description: "A catchy title for the trip" },
          destinationSummary: { type: Type.STRING, description: "A 2-sentence summary of the destination vibe" },
          totalEstimatedCost: { type: Type.STRING, description: "Estimated total cost range for the group" },
          dailyPlans: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                date: { type: Type.STRING, description: "YYYY-MM-DD format" },
                theme: { type: Type.STRING, description: "Theme of the day, e.g., 'Historical Exploration'" },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING, description: "e.g., 09:00 AM" },
                      title: { type: Type.STRING, description: "Name of the activity or place" },
                      description: { type: Type.STRING, description: "What to do there" },
                      location: { type: Type.STRING, description: "Address or area name" },
                      type: { 
                        type: Type.STRING, 
                        enum: ['sightseeing', 'food', 'relax', 'adventure', 'culture'],
                        description: "Category of activity"
                      },
                      costEstimate: { type: Type.STRING, description: "Estimated cost for this activity" }
                    },
                    required: ["time", "title", "description", "location", "type", "costEstimate"]
                  }
                }
              },
              required: ["dayNumber", "date", "theme", "activities"]
            }
          }
        },
        required: ["tripTitle", "destinationSummary", "totalEstimatedCost", "dailyPlans"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(text) as Itinerary;
  } catch (e) {
    console.error("Failed to parse JSON response", e);
    throw new Error("Failed to generate a valid itinerary format.");
  }
};
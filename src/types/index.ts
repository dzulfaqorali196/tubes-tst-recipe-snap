export interface User {
    id: string;
    email: string;
    preferences?: Record<string, any>;
  }
  
  export interface Recipe {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
  }
  
  export interface AnalyzedIngredient {
    description: string;
    confidence: number;
  }
  
  export interface HistoryEntry {
    recipe: Recipe;
    ingredients: { 
      name: string; 
      confidence: number;
    }[];
    created_at: string;
  }
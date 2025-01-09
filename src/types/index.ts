export interface User {
    id: string;
    email: string;
    preferences?: Record<string, any>;
  }
  
  export interface Recipe {
    id: string;
    name: string;
    description?: string;
    ingredients: string[];
    instructions: string[];
    image?: string;
    cookTime?: string;
    servings?: number;
    difficulty?: string;
    cuisine?: string;
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
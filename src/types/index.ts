export interface User {
    id: string;
    email: string;
    preferences?: Record<string, any>;
  }
  
  export interface Recipe {
    id: string;
    title: string;
    name?: string;
    ingredients: string[];
    instructions: string[];
    image_url?: string;
    created_at: string;
    user_id: string;
    cooking_time?: number;
    difficulty?: 'mudah' | 'sedang' | 'sulit';
    cuisine_type?: string;
    serving_size?: number;
    calories?: number;
    tags?: string[];
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
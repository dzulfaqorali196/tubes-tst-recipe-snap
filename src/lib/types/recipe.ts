export interface Recipe {
  id: string;
  title: string;
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
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      image_analysis: {
        Row: {
          id: string;
          user_id: string;
          image_path: string | null;
          image_url: string | null;
          ingredients: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_path?: string | null;
          image_url?: string | null;
          ingredients: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_path?: string | null;
          image_url?: string | null;
          ingredients?: Json;
          created_at?: string;
        };
      };
      recipe_history: {
        Row: {
          id: string;
          user_id: string;
          recipe_data: any;
          ingredients: { name: string; confidence: number }[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_data: any;
          ingredients: { name: string; confidence: number }[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipe_data?: any;
          ingredients?: { name: string; confidence: number }[];
          created_at?: string;
        };
      };
      shared_recipes: {
        Row: {
          id: string;
          user_id: string;
          recipe_data: Json;
          shared_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_data: Json;
          shared_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipe_data?: Json;
          shared_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 
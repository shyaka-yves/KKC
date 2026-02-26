export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  price: number | null;
  currency: "RWF" | "USD" | null;
  show_price: boolean;
  visible: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export type FavoriteRow = {
  user_id: string;
  product_id: string;
  created_at: string;
};

export type RoleRow = {
  user_id: string;
  role: string;
  admin: boolean;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProductRow, "id">>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<CategoryRow, "id">>;
        Relationships: [];
      };
      favorites: {
        Row: FavoriteRow;
        Insert: Omit<FavoriteRow, "created_at"> & { created_at?: string };
        Update: Partial<FavoriteRow>;
        Relationships: [];
      };
      roles: {
        Row: RoleRow;
        Insert: Omit<RoleRow, "created_at"> & { created_at?: string };
        Update: Partial<RoleRow>;
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

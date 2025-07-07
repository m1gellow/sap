type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          brand: string;
          price: number;
          image: string;
          category_id: number;
          in_stock: boolean;
          description: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          brand: string;
          price: number;
          image: string;
          category_id: number;
          in_stock?: boolean;
          description?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          brand?: string;
          price?: number;
          image?: string;
          category_id?: number;
          in_stock?: boolean;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          active: boolean;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          active?: boolean;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          active?: boolean;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: number;
          created_at: string;
          user_id: string | null;
          total_amount: number;
          status: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: string;
          payment_method: string;
          notes: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id?: string | null;
          total_amount: number;
          status: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: string;
          payment_method: string;
          notes?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string | null;
          total_amount?: number;
          status?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          delivery_address?: string;
          payment_method?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          id: number;
          created_at: string;
          order_id: number;
          product_id: number;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          order_id: number;
          product_id: number;
          quantity: number;
          price: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          order_id?: number;
          product_id?: number;
          quantity?: number;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      admins: {
        Row: {
          id: string;
          created_at: string;
          username: string;
          name: string;
          role: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          username: string;
          name: string;
          role: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string;
          name?: string;
          role?: string;
          last_login?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'admins_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_profiles: {
        Row: {
          id: string;
          created_at: string;
          name: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          avatar_url: string | null;
          role: string;
          status: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          name?: string | null;
          email: string;
          phone?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          role?: string;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string | null;
          email?: string;
          phone?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          role?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      favorites: {
        Row: {
          id: number;
          created_at: string;
          user_id: string;
          product_id: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id: string;
          product_id: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string;
          product_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      content: {
        Row: {
          id: number;
          created_at: string;
          type: string;
          title: string;
          description: string | null;
          content_json: Json | null;
          page: string;
          last_updated: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          type: string;
          title: string;
          description?: string | null;
          content_json?: Json | null;
          page: string;
          last_updated: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          type?: string;
          title?: string;
          description?: string | null;
          content_json?: Json | null;
          page?: string;
          last_updated?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          id: number;
          created_at: string;
          key: string;
          value: Json;
          description: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          key: string;
          value: Json;
          description?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          key?: string;
          value?: Json;
          description?: string | null;
        };
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
};
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          last_login: string | null
          name: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          last_login?: string | null
          name: string
          role: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          last_login?: string | null
          name?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: number
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      cdek_webhooks: {
        Row: {
          cdek_number: string | null
          created_at: string
          data: Json
          id: number
          order_uuid: string | null
          status: string | null
          type: string
        }
        Insert: {
          cdek_number?: string | null
          created_at?: string
          data: Json
          id?: never
          order_uuid?: string | null
          status?: string | null
          type: string
        }
        Update: {
          cdek_number?: string | null
          created_at?: string
          data?: Json
          id?: never
          order_uuid?: string | null
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          content_json: Json | null
          created_at: string
          description: string | null
          id: number
          last_updated: string
          page: string
          title: string
          type: string
        }
        Insert: {
          content_json?: Json | null
          created_at?: string
          description?: string | null
          id?: number
          last_updated?: string
          page: string
          title: string
          type: string
        }
        Update: {
          content_json?: Json | null
          created_at?: string
          description?: string | null
          id?: number
          last_updated?: string
          page?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: number
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number
          user_id?: string
        }
        Relationships: []
      }
      image_cache: {
        Row: {
          id: string
          last_updated: string
          original_url: string
          product_id: string | null
          public_url: string
          storage_path: string
        }
        Insert: {
          id?: string
          last_updated?: string
          original_url: string
          product_id?: string | null
          public_url: string
          storage_path: string
        }
        Update: {
          id?: string
          last_updated?: string
          original_url?: string
          product_id?: string | null
          public_url?: string
          storage_path?: string
        }
        Relationships: []
      }
      moysklad_categories: {
        Row: {
          code: string | null
          created_at: string | null
          external_code: string | null
          id: string
          moysklad_id: string
          name: string
          parent_id: string | null
          path_name: string | null
          updated: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          external_code?: string | null
          id?: string
          moysklad_id: string
          name: string
          parent_id?: string | null
          path_name?: string | null
          updated?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          external_code?: string | null
          id?: string
          moysklad_id?: string
          name?: string
          parent_id?: string | null
          path_name?: string | null
          updated?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      moysklad_products: {
        Row: {
          archived: boolean | null
          article: string | null
          description: string | null
          id: string
          image_url: string | null
          in_transit: number | null
          name: string
          path_name: string | null
          reserve: number | null
          sale_price: number | null
          stock: number | null
          updated: string | null
          weight: number | null
        }
        Insert: {
          archived?: boolean | null
          article?: string | null
          description?: string | null
          id: string
          image_url?: string | null
          in_transit?: number | null
          name: string
          path_name?: string | null
          reserve?: number | null
          sale_price?: number | null
          stock?: number | null
          updated?: string | null
          weight?: number | null
        }
        Update: {
          archived?: boolean | null
          article?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_transit?: number | null
          name?: string
          path_name?: string | null
          reserve?: number | null
          sale_price?: number | null
          stock?: number | null
          updated?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      moysklad_staging: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          raw_data: Json
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          processed_at?: string | null
          raw_data: Json
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          raw_data?: Json
          status?: string | null
        }
        Relationships: []
      }
      moysklad_sync_history: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status: string
          type: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      order_cdek_details: {
        Row: {
          cdek_data: Json
          cdek_number: string | null
          cdek_status: string
          cdek_uuid: string
          created_at: string
          id: number
          order_id: number
          updated_at: string
        }
        Insert: {
          cdek_data: Json
          cdek_number?: string | null
          cdek_status?: string
          cdek_uuid: string
          created_at?: string
          id?: never
          order_id: number
          updated_at?: string
        }
        Update: {
          cdek_data?: Json
          cdek_number?: string | null
          cdek_status?: string
          cdek_uuid?: string
          created_at?: string
          id?: never
          order_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_cdek_details_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: number
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "moysklad_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id: number
          notes: string | null
          payment_method: string
          status: string
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id?: number
          notes?: string | null
          payment_method: string
          status: string
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          id?: number
          notes?: string | null
          payment_method?: string
          status?: string
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          description: string | null
          id: number
          key: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          key: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          key?: string
          value?: Json
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: { user_email: string; user_name: string; user_username?: string }
        Returns: string
      }
      create_cdek_webhooks_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

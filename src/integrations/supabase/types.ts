export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          company: string
          contact: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          name: string
          service: string
        }
        Insert: {
          company?: string
          contact: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          service?: string
        }
        Update: {
          company?: string
          contact?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          service?: string
        }
        Relationships: []
      }
      project_media: {
        Row: {
          caption: string
          created_at: string
          frame: Database["public"]["Enums"]["media_frame"]
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          project_id: string
          sort_order: number
          url: string
        }
        Insert: {
          caption?: string
          created_at?: string
          frame?: Database["public"]["Enums"]["media_frame"]
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          project_id: string
          sort_order?: number
          url: string
        }
        Update: {
          caption?: string
          created_at?: string
          frame?: Database["public"]["Enums"]["media_frame"]
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          project_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          after_image_url: string | null
          before_image_url: string | null
          business_description: string
          categories: string[]
          client_category: string
          client_needs: string
          cover_url: string | null
          created_at: string
          external_label: string | null
          external_url: string | null
          id: string
          is_demo: boolean
          is_featured: boolean
          is_published: boolean
          services: string[]
          short_description: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          work_done: string
        }
        Insert: {
          after_image_url?: string | null
          before_image_url?: string | null
          business_description?: string
          categories?: string[]
          client_category?: string
          client_needs?: string
          cover_url?: string | null
          created_at?: string
          external_label?: string | null
          external_url?: string | null
          id?: string
          is_demo?: boolean
          is_featured?: boolean
          is_published?: boolean
          services?: string[]
          short_description?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          work_done?: string
        }
        Update: {
          after_image_url?: string | null
          before_image_url?: string | null
          business_description?: string
          categories?: string[]
          client_category?: string
          client_needs?: string
          cover_url?: string | null
          created_at?: string
          external_label?: string | null
          external_url?: string | null
          id?: string
          is_demo?: boolean
          is_featured?: boolean
          is_published?: boolean
          services?: string[]
          short_description?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          work_done?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          brand_description: string
          brand_name: string
          brand_suffix: string
          email: string | null
          facebook_url: string | null
          hero_laptop_url: string | null
          hero_phone_1_url: string | null
          hero_phone_2_url: string | null
          id: boolean
          instagram_url: string | null
          owner_name: string
          phone: string | null
          portrait_url: string | null
          tiktok_url: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          brand_description?: string
          brand_name?: string
          brand_suffix?: string
          email?: string | null
          facebook_url?: string | null
          hero_laptop_url?: string | null
          hero_phone_1_url?: string | null
          hero_phone_2_url?: string | null
          id?: boolean
          instagram_url?: string | null
          owner_name?: string
          phone?: string | null
          portrait_url?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          brand_description?: string
          brand_name?: string
          brand_suffix?: string
          email?: string | null
          facebook_url?: string | null
          hero_laptop_url?: string | null
          hero_phone_1_url?: string | null
          hero_phone_2_url?: string | null
          id?: boolean
          instagram_url?: string | null
          owner_name?: string
          phone?: string | null
          portrait_url?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      track_site_event: {
        Args: { p_visitor: string; p_kind: string; p_path: string; p_target?: string }
        Returns: undefined
      }
      admin_analytics: {
        Args: { p_days?: number }
        Returns: Json
      }
      admin_exists: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      media_frame: "none" | "laptop" | "phone"
      media_kind: "image" | "video" | "embed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      media_frame: ["none", "laptop", "phone"],
      media_kind: ["image", "video", "embed"],
    },
  },
} as const

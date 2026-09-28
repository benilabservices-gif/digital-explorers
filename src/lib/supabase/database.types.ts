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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      adventure_completions: {
        Row: {
          adventure_id: string
          child_id: string
          completed_at: string
          id: string
          quiz_max: number
          quiz_score: number
        }
        Insert: {
          adventure_id: string
          child_id: string
          completed_at?: string
          id?: string
          quiz_max?: number
          quiz_score?: number
        }
        Update: {
          adventure_id?: string
          child_id?: string
          completed_at?: string
          id?: string
          quiz_max?: number
          quiz_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "adventure_completions_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adventure_completions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      adventures: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          slug: string
          sort_order: number
          story: string
          title: string
          world_id: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          story?: string
          title: string
          world_id: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          story?: string
          title?: string
          world_id?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "adventures_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          description: string
          icon: string
          id: string
          name: string
          rarity: string
          required_completions: number
          slug: string
          sort_order: number
          world_id: string | null
          xp_required: number
        }
        Insert: {
          description?: string
          icon?: string
          id?: string
          name: string
          rarity?: string
          required_completions?: number
          slug: string
          sort_order?: number
          world_id?: string | null
          xp_required?: number
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: string
          required_completions?: number
          slug?: string
          sort_order?: number
          world_id?: string | null
          xp_required?: number
        }
        Relationships: [
          {
            foreignKeyName: "badges_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_completions: {
        Row: {
          challenge_id: string
          child_id: string
          completed_at: string
        }
        Insert: {
          challenge_id: string
          child_id: string
          completed_at?: string
        }
        Update: {
          challenge_id?: string
          child_id?: string
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_completions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          badge_slug: string | null
          description: string
          id: string
          is_active: boolean
          slug: string
          title: string
          type: string
          world_slug: string | null
          xp_reward: number
        }
        Insert: {
          badge_slug?: string | null
          description?: string
          id?: string
          is_active?: boolean
          slug: string
          title: string
          type: string
          world_slug?: string | null
          xp_reward?: number
        }
        Update: {
          badge_slug?: string | null
          description?: string
          id?: string
          is_active?: boolean
          slug?: string
          title?: string
          type?: string
          world_slug?: string | null
          xp_reward?: number
        }
        Relationships: []
      }
      children: {
        Row: {
          age: number
          avatar: string
          created_at: string
          grade_level: string
          id: string
          interests: string[]
          level: number
          name: string
          parent_id: string
          phase: string
          xp: number
        }
        Insert: {
          age: number
          avatar?: string
          created_at?: string
          grade_level?: string
          id?: string
          interests?: string[]
          level?: number
          name: string
          parent_id: string
          phase?: string
          xp?: number
        }
        Update: {
          age?: number
          avatar?: string
          created_at?: string
          grade_level?: string
          id?: string
          interests?: string[]
          level?: number
          name?: string
          parent_id?: string
          phase?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      children_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          child_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          child_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          child_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_badges_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_bridges: {
        Row: {
          color: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          target_url: string
          world_id: string | null
        }
        Insert: {
          color?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          target_url: string
          world_id?: string | null
        }
        Update: {
          color?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          target_url?: string
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_bridges_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          adventure_id: string
          content: string
          id: string
          section_type: string
          sort_order: number
          title: string
        }
        Insert: {
          adventure_id: string
          content?: string
          id?: string
          section_type: string
          sort_order?: number
          title?: string
        }
        Update: {
          adventure_id?: string
          content?: string
          id?: string
          section_type?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          code: string
          features: Json
          max_children: number
          max_worlds: number
          name: string
          period: string
          price_fcfa: number
          sort_order: number
          tagline: string
        }
        Insert: {
          code: string
          features?: Json
          max_children?: number
          max_worlds?: number
          name: string
          period?: string
          price_fcfa?: number
          sort_order?: number
          tagline?: string
        }
        Update: {
          code?: string
          features?: Json
          max_children?: number
          max_worlds?: number
          name?: string
          period?: string
          price_fcfa?: number
          sort_order?: number
          tagline?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          adventure_id: string
          correct_index: number
          explanation: string | null
          id: string
          options: Json
          question: string
          sort_order: number
        }
        Insert: {
          adventure_id: string
          correct_index: number
          explanation?: string | null
          id?: string
          options: Json
          question: string
          sort_order?: number
        }
        Update: {
          adventure_id?: string
          correct_index?: number
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          expires_at: string | null
          id: string
          parent_id: string
          plan_code: string
          started_at: string
          status: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          parent_id: string
          plan_code: string
          started_at?: string
          status?: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          parent_id?: string
          plan_code?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_code_fkey"
            columns: ["plan_code"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["code"]
          },
        ]
      }
      worlds: {
        Row: {
          color: string
          created_at: string
          description: string
          gradient: string
          icon: string
          id: string
          is_active: boolean
          name: string
          phase: string
          slug: string
          sort_order: number
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          phase?: string
          slug: string
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          phase?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
    Enums: {},
  },
} as const

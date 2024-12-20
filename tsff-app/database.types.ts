export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          published_at: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          published_at?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          published_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      field_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          field_id: string | null
          id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          field_id?: string | null
          id?: string
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          field_id?: string | null
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_availability_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
        }
        Relationships: []
      }
      match_events: {
        Row: {
          created_at: string
          event_time: number | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          match_id: string | null
          player_id: string | null
        }
        Insert: {
          created_at?: string
          event_time?: number | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          match_id?: string | null
          player_id?: string | null
        }
        Update: {
          created_at?: string
          event_time?: number | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          match_id?: string | null
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      match_reschedule_requests: {
        Row: {
          created_at: string
          id: string
          match_id: string | null
          proposed_end_time: string | null
          proposed_start_time: string | null
          requested_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_id?: string | null
          proposed_end_time?: string | null
          proposed_start_time?: string | null
          requested_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string | null
          proposed_end_time?: string | null
          proposed_start_time?: string | null
          requested_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_reschedule_requests_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_reschedule_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "match_reschedule_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      match_schedule: {
        Row: {
          created_at: string
          end_time: string | null
          field_id: string | null
          id: string
          match_id: string | null
          scheduled_by: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          field_id?: string | null
          id?: string
          match_id?: string | null
          scheduled_by?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          field_id?: string | null
          id?: string
          match_id?: string | null
          scheduled_by?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_schedule_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_schedule_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_schedule_scheduled_by_fkey"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      match_squads: {
        Row: {
          created_at: string
          id: string
          match_id: string | null
          player_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_id?: string | null
          player_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string | null
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_squads_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_squads_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number
          away_season_team_id: string | null
          created_at: string
          home_score: number
          home_season_team_id: string | null
          id: string
          referee_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          away_score?: number
          away_season_team_id?: string | null
          created_at?: string
          home_score?: number
          home_season_team_id?: string | null
          id?: string
          referee_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          away_score?: number
          away_season_team_id?: string | null
          created_at?: string
          home_score?: number
          home_season_team_id?: string | null
          id?: string
          referee_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_season_team_id_fkey"
            columns: ["away_season_team_id"]
            isOneToOne: false
            referencedRelation: "season_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_season_team_id_fkey"
            columns: ["home_season_team_id"]
            isOneToOne: false
            referencedRelation: "season_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "referees"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipients: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          read: boolean | null
          recipient_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          created_at: string
          id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      player_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          id: string
          requested_at: string
          season_team_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          requested_at?: string
          season_team_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          requested_at?: string
          season_team_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "player_requests_season_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "season_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: string
          season_team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          season_team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          season_team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_season_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: false
            referencedRelation: "season_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      referee_assignment_history: {
        Row: {
          assigned_at: string
          id: string
          match_id: string | null
          referee_id: string | null
        }
        Insert: {
          assigned_at?: string
          id?: string
          match_id?: string | null
          referee_id?: string | null
        }
        Update: {
          assigned_at?: string
          id?: string
          match_id?: string | null
          referee_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referee_assignment_history_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referee_assignment_history_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "referees"
            referencedColumns: ["id"]
          },
        ]
      }
      referee_availability: {
        Row: {
          available: boolean
          created_at: string
          id: string
          match_id: string | null
          referee_id: string | null
        }
        Insert: {
          available?: boolean
          created_at?: string
          id?: string
          match_id?: string | null
          referee_id?: string | null
        }
        Update: {
          available?: boolean
          created_at?: string
          id?: string
          match_id?: string | null
          referee_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referee_availability_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referee_availability_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "referees"
            referencedColumns: ["id"]
          },
        ]
      }
      referees: {
        Row: {
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          role_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_name: string
        }
        Update: {
          created_at?: string
          id?: string
          role_name?: string
        }
        Relationships: []
      }
      season_divisions: {
        Row: {
          created_at: string
          division_name: string
          id: string
          phase: string
          season_id: string | null
        }
        Insert: {
          created_at?: string
          division_name: string
          id?: string
          phase: string
          season_id?: string | null
        }
        Update: {
          created_at?: string
          division_name?: string
          id?: string
          phase?: string
          season_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "season_divisions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      season_team_standings: {
        Row: {
          created_at: string
          goals_against: number
          goals_scored: number
          id: string
          points: number
          position: number
          season_team_id: string | null
        }
        Insert: {
          created_at?: string
          goals_against: number
          goals_scored: number
          id?: string
          points: number
          position: number
          season_team_id?: string | null
        }
        Update: {
          created_at?: string
          goals_against?: number
          goals_scored?: number
          id?: string
          points?: number
          position?: number
          season_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "season_team_standings_season_team_id_fkey"
            columns: ["season_team_id"]
            isOneToOne: true
            referencedRelation: "season_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      season_teams: {
        Row: {
          created_at: string
          id: string
          season_division_id: string | null
          team_id: string | null
          team_leader: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          season_division_id?: string | null
          team_id?: string | null
          team_leader?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          season_division_id?: string | null
          team_id?: string | null
          team_leader?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "season_teams_season_division_id_fkey"
            columns: ["season_division_id"]
            isOneToOne: false
            referencedRelation: "season_divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_teams_team_leader_fkey"
            columns: ["team_leader"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          end_date: string
          id: string
          start_date: string
          year_label: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          start_date: string
          year_label: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          year_label?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          assists: number
          created_at: string
          goals_scored: number
          id: string
          matches_played: number
          player_id: string | null
          red_cards: number
          yellow_cards: number
        }
        Insert: {
          assists?: number
          created_at?: string
          goals_scored?: number
          id?: string
          matches_played?: number
          player_id?: string | null
          red_cards?: number
          yellow_cards?: number
        }
        Update: {
          assists?: number
          created_at?: string
          goals_scored?: number
          id?: string
          matches_played?: number
          player_id?: string | null
          red_cards?: number
          yellow_cards?: number
        }
        Relationships: [
          {
            foreignKeyName: "stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          social_links: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          social_links?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          social_links?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      user_with_roles: {
        Row: {
          role_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_type: "goal" | "yellow_card" | "red_card"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never


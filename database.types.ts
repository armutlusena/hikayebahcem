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
      profiles: {
        Row: {
          id: string
          full_name: string
          age: number
          reading_level: number
          font_size: number
          background_color: string
          line_spacing: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          age: number
          reading_level?: number
          font_size?: number
          background_color?: string
          line_spacing?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          age?: number
          reading_level?: number
          font_size?: number
          background_color?: string
          line_spacing?: number
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          attention_score: number | null
          discrimination_score: number | null
          processing_speed: number | null
          reading_level: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          attention_score?: number | null
          discrimination_score?: number | null
          processing_speed?: number | null
          reading_level?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          attention_score?: number | null
          discrimination_score?: number | null
          processing_speed?: number | null
          reading_level?: number | null
          completed_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          title: string
          type: string
          difficulty: number
          content: Json
          duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          difficulty: number
          content: Json
          duration_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          difficulty?: number
          content?: Json
          duration_minutes?: number
          created_at?: string
        }
      }
      reading_sessions: {
        Row: {
          id: string
          user_id: string
          text_content: string
          reading_speed_wpm: number | null
          accuracy_percentage: number | null
          pause_count: number
          error_words: Json
          duration_seconds: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text_content: string
          reading_speed_wpm?: number | null
          accuracy_percentage?: number | null
          pause_count?: number
          error_words?: Json
          duration_seconds?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text_content?: string
          reading_speed_wpm?: number | null
          accuracy_percentage?: number | null
          pause_count?: number
          error_words?: Json
          duration_seconds?: number | null
          completed_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          criteria: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          criteria: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          criteria?: Json
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string
          total_sessions: number
          total_words_read: number
          average_accuracy: number
          current_streak_days: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_sessions?: number
          total_words_read?: number
          average_accuracy?: number
          current_streak_days?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_sessions?: number
          total_words_read?: number
          average_accuracy?: number
          current_streak_days?: number
          updated_at?: string
        }
      }
      activity_completions: {
        Row: {
          id: string
          user_id: string
          activity_id: string
          score: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_id: string
          score?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_id?: string
          score?: number | null
          completed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

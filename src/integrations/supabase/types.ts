export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_id: string | null
          hospital_id: string | null
          id: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          medicine_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medicine_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medicine_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_availability: {
        Row: {
          created_at: string
          date: string
          doctor_id: string | null
          id: string
          is_available: boolean | null
          time_slots: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          doctor_id?: string | null
          id?: string
          is_available?: boolean | null
          time_slots: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_id?: string | null
          id?: string
          is_available?: boolean | null
          time_slots?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_availability_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          consultation_fee: number
          created_at: string
          hospital_id: string | null
          id: string
          image_url: string | null
          name: string
          specialty: Database["public"]["Enums"]["doctor_specialty"]
          updated_at: string
        }
        Insert: {
          consultation_fee: number
          created_at?: string
          hospital_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          specialty: Database["public"]["Enums"]["doctor_specialty"]
          updated_at?: string
        }
        Update: {
          consultation_fee?: number
          created_at?: string
          hospital_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          specialty?: Database["public"]["Enums"]["doctor_specialty"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean
          created_at: string
          donor_id: string | null
          id: string
          medical_need_id: string
          message: string | null
        }
        Insert: {
          amount: number
          anonymous?: boolean
          created_at?: string
          donor_id?: string | null
          id?: string
          medical_need_id: string
          message?: string | null
        }
        Update: {
          amount?: number
          anonymous?: boolean
          created_at?: string
          donor_id?: string | null
          id?: string
          medical_need_id?: string
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_medical_need_id_fkey"
            columns: ["medical_need_id"]
            isOneToOne: false
            referencedRelation: "medical_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      medical_needs: {
        Row: {
          amount_needed: number
          amount_raised: number
          created_at: string
          description: string
          id: string
          location: string
          medical_proof_url: string | null
          status: Database["public"]["Enums"]["medical_need_status"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["medical_need_urgency"]
          user_id: string
        }
        Insert: {
          amount_needed: number
          amount_raised?: number
          created_at?: string
          description: string
          id?: string
          location: string
          medical_proof_url?: string | null
          status?: Database["public"]["Enums"]["medical_need_status"]
          title: string
          updated_at?: string
          urgency: Database["public"]["Enums"]["medical_need_urgency"]
          user_id: string
        }
        Update: {
          amount_needed?: number
          amount_raised?: number
          created_at?: string
          description?: string
          id?: string
          location?: string
          medical_proof_url?: string | null
          status?: Database["public"]["Enums"]["medical_need_status"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["medical_need_urgency"]
          user_id?: string
        }
        Relationships: []
      }
      medicine_orders: {
        Row: {
          created_at: string
          delivery_address: string
          id: string
          medicine_details: Json
          prescription_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address: string
          id?: string
          medicine_details: Json
          prescription_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address?: string
          id?: string
          medicine_details?: Json
          prescription_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicine_orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          category: Database["public"]["Enums"]["medicine_category"]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          name: string
          price: number
          requires_prescription: boolean | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["medicine_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          price: number
          requires_prescription?: boolean | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["medicine_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
          requires_prescription?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          prescription_url: string | null
          status: Database["public"]["Enums"]["prescription_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          prescription_url?: string | null
          status?: Database["public"]["Enums"]["prescription_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          prescription_url?: string | null
          status?: Database["public"]["Enums"]["prescription_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      doctor_specialty:
        | "general_physician"
        | "cardiologist"
        | "dermatologist"
        | "pediatrician"
        | "orthopedic"
        | "neurologist"
      medical_need_status:
        | "pending"
        | "verified"
        | "in_progress"
        | "completed"
        | "rejected"
      medical_need_urgency: "low" | "medium" | "high" | "critical"
      medicine_category:
        | "pain_relief"
        | "cold_and_flu"
        | "digestive_health"
        | "first_aid"
        | "vitamins"
        | "diabetes"
        | "heart_health"
        | "skin_care"
      prescription_status: "pending" | "verified" | "rejected"
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

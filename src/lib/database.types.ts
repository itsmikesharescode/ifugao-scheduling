import type { DynamicForm, MetaData } from './types';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      deparments_tb: {
        Row: {
          code: string;
          color: string;
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          code: string;
          color: string;
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          code?: string;
          color?: string;
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      faculties_tb: {
        Row: {
          academic_rank: string;
          birth_date: string;
          created_at: string;
          departments: number[];
          first_name: string;
          gender: string;
          id: number;
          last_name: string;
          middle_name: string;
          status: string;
        };
        Insert: {
          academic_rank: string;
          birth_date: string;
          created_at?: string;
          departments: number[];
          first_name: string;
          gender: string;
          id?: number;
          last_name: string;
          middle_name: string;
          status: string;
        };
        Update: {
          academic_rank?: string;
          birth_date?: string;
          created_at?: string;
          departments?: number[];
          first_name?: string;
          gender?: string;
          id?: number;
          last_name?: string;
          middle_name?: string;
          status?: string;
        };
        Relationships: [];
      };
      roles_tb: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      schedules_tb: {
        Row: {
          created_at: string;
          days: string[];
          department_id: number;
          dynamic_form: DynamicForm[];
          end_time: string;
          faculty_id: number;
          id: number;
          school_year: string;
          semester: string;
          start_time: string;
        };
        Insert: {
          created_at?: string;
          days: string[];
          department_id: number;
          dynamic_form: DynamicForm[];
          end_time: string;
          faculty_id: number;
          id?: number;
          school_year: string;
          semester: string;
          start_time: string;
        };
        Update: {
          created_at?: string;
          days?: string[];
          department_id?: number;
          dynamic_form?: DynamicForm[];
          end_time?: string;
          faculty_id?: number;
          id?: number;
          school_year?: string;
          semester?: string;
          start_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'schedules_tb_faculty_id_fkey';
            columns: ['faculty_id'];
            isOneToOne: false;
            referencedRelation: 'faculties_tb';
            referencedColumns: ['id'];
          }
        ];
      };
      sections_tb: {
        Row: {
          created_at: string;
          departments: number[];
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          departments: number[];
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          departments?: number[];
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      subjects_tb: {
        Row: {
          code: string;
          created_at: string;
          departments: number[];
          id: number;
          name: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          departments: number[];
          id?: number;
          name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          departments?: number[];
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      users_role_tb: {
        Row: {
          created_at: string;
          id: number;
          role_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          role_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          role_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_role_tb_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles_tb';
            referencedColumns: ['id'];
          }
        ];
      };
      users_tb: {
        Row: {
          created_at: string;
          meta_data: MetaData;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          meta_data: MetaData;
          user_id: string;
        };
        Update: {
          created_at?: string;
          meta_data?: MetaData;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      helper_admin_setter: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      helper_check_role: {
        Args: {
          client_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

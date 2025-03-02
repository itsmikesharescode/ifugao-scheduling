import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>;
      supabaseAdmin: SupabaseClient<Database>;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null;
      user: User | null;
      role: string | null;
    }
    interface PageData {
      session: Session | null;
      user?: User | null;
      supabase?: SupabaseClient<Database> | undefined;
      departments: Database['public']['Tables']['deparments_tb']['Row'][] | null;
      role: string | null;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};

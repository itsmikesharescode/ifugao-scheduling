import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabase, role },
  cookies
}) => {
  const { session } = await safeGetSession();

  const getDepartments = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase.from('deparments_tb').select('*').order('created_at');

    if (error) return null;
    return data;
  };

  return {
    session,
    cookies: cookies.getAll(),
    departments: await getDepartments(),
    role
  };
};

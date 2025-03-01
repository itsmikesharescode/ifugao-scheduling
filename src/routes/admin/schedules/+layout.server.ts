import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, url }) => {
  const getSchedules = async () => {
    if (!supabase) return null;

    const filter = url.searchParams.get('filter');

    if (filter) {
      const { data, error } = await supabase
        .from('schedules_tb')
        .select('*')
        .eq('department_id', Number(filter));
      if (error) return null;
      return data;
    }

    const { data, error } = await supabase.from('schedules_tb').select('*').order('created_at');

    if (error) return null;

    return data;
  };

  return {
    schedules: await getSchedules()
  };
};

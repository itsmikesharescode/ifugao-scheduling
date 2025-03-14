import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { createSchedSchema, updateSchedSchema, deleteSchedSchema } from './components/forms/schema';

export const load: PageServerLoad = async () => {
  return {
    createSchedForm: await superValidate(zod(createSchedSchema)),
    updateSchedForm: await superValidate(zod(updateSchedSchema)),
    deleteSchedForm: await superValidate(zod(deleteSchedSchema))
  };
};

export const actions: Actions = {
  createSchedEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(createSchedSchema));
    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.rpc('fn_add_schedule', {
      faculty_id: form.data.faculty_id,
      days: form.data.schedule.days,
      department_id: form.data.department_id,
      dynamic_form: form.data.dynamic_form,
      school_year: form.data.school_year,
      semester: form.data.semester,
      start_time: form.data.schedule.start_time,
      end_time: form.data.schedule.end_time
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Schedule created successfully' };
  },

  updateSchedEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateSchedSchema));

    console.log(form.data);

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase
      .from('schedules_tb')
      .update({
        faculty_id: form.data.faculty_id,
        days: form.data.schedule.days,
        department_id: form.data.department_id,
        dynamic_form: form.data.dynamic_form,
        end_time: form.data.schedule.end_time,
        school_year: form.data.school_year,
        semester: form.data.semester,
        start_time: form.data.schedule.start_time
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Schedule updated successfully' };
  },

  deleteSchedEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteSchedSchema));
    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('schedules_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Schedule deleted successfully' };
  }
};

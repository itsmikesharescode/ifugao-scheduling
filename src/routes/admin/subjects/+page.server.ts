import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { createSubSchema, updateSubSchema, deleteSubSchema } from './components/forms/schema';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  const getSubjects = async () => {
    if (!supabase) return null;

    const filter = url.searchParams.get('filter');

    if (filter) {
      const { data, error } = await supabase
        .from('subjects_tb')
        .select('*')
        .contains('departments', JSON.stringify([Number(filter)]));
      if (error) return null;
      return data;
    }

    const { data, error } = await supabase.from('subjects_tb').select('*').order('created_at');

    if (error) return null;

    return data;
  };
  return {
    createSubForm: await superValidate(zod(createSubSchema)),
    updateSubForm: await superValidate(zod(updateSubSchema)),
    deleteSubForm: await superValidate(zod(deleteSubSchema)),
    subjects: await getSubjects()
  };
};

export const actions: Actions = {
  createSubEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(createSubSchema));
    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('subjects_tb').insert({
      code: form.data.code,
      name: form.data.name,
      departments: form.data.departments
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Subject created successfully' };
  },

  updateSubEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateSubSchema));
    if (!form.valid) return fail(400, { form });

    const { error } = await supabase
      .from('subjects_tb')
      .update({
        code: form.data.code,
        name: form.data.name,
        departments: form.data.departments
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Subject updated successfully' };
  },

  deleteSubEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteSubSchema));
    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('subjects_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Subject deleted successfully' };
  }
};

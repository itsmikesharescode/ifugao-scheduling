import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createSecSchema, updateSecSchema, deleteSecSchema } from './components/forms/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  //get subjects based in query params of departments
  const getSections = async () => {
    if (!supabase) return null;

    const filter = url.searchParams.get('filter');

    if (filter) {
      const { data, error } = await supabase
        .from('sections_tb')
        .select('*')
        .contains('departments', JSON.stringify([Number(filter)]));
      if (error) return null;
      return data;
    }

    const { data, error } = await supabase.from('sections_tb').select('*').order('created_at');

    if (error) return null;

    return data;
  };
  return {
    createSecForm: await superValidate(zod(createSecSchema)),
    updateSecForm: await superValidate(zod(updateSecSchema)),
    deleteSecForm: await superValidate(zod(deleteSecSchema)),
    sections: await getSections()
  };
};

export const actions: Actions = {
  createSecEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(createSecSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('sections_tb').insert({
      name: form.data.name,
      departments: form.data.departments
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Section created successfully' };
  },

  updateSecEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateSecSchema));

    if (!form.valid) return fail(400, { form });
    const { error } = await supabase
      .from('sections_tb')
      .update({
        name: form.data.name,
        departments: form.data.departments
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Section updated successfully' };
  },

  deleteSecEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteSecSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('sections_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Section deleted successfully' };
  }
};

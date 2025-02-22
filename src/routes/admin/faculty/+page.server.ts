import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createFacSchema, updateFacSchema, deleteFacSchema } from './components/forms/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  //get faculties based in query params of departments
  const getFaculties = async () => {
    if (!supabase) return null;

    const filter = url.searchParams.get('filter');

    if (filter) {
      const { data, error } = await supabase
        .from('faculties_tb')
        .select('*')
        .contains('departments', JSON.stringify([Number(filter)]));
      if (error) return null;
      return data;
    }

    const { data, error } = await supabase.from('faculties_tb').select('*').order('created_at');

    if (error) return null;

    return data;
  };

  return {
    createFacForm: await superValidate(zod(createFacSchema)),
    updateFacForm: await superValidate(zod(updateFacSchema)),
    deleteFacForm: await superValidate(zod(deleteFacSchema)),
    faculties: await getFaculties()
  };
};

export const actions: Actions = {
  createFacEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(createFacSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('faculties_tb').insert({
      first_name: form.data.first_name,
      last_name: form.data.last_name,
      middle_name: form.data.middle_name,
      gender: form.data.gender,
      birth_date: form.data.birth_date,
      academic_rank: form.data.academic_rank,
      status: form.data.status,
      departments: form.data.departments
    });

    if (error) {
      return fail(400, { form, msg: error.message });
    }

    return { form, msg: 'Faculty created successfully' };
  },

  updateFacEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateFacSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('faculties_tb')
      .update({
        first_name: form.data.first_name,
        last_name: form.data.last_name,
        middle_name: form.data.middle_name,
        gender: form.data.gender,
        birth_date: form.data.birth_date,
        academic_rank: form.data.academic_rank,
        status: form.data.status,
        departments: form.data.departments
      })
      .eq('id', form.data.id);

    if (error) {
      return fail(400, { form, msg: error.message });
    }

    return { form, msg: 'Faculty updated successfully' };
  },

  deleteFacEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteFacSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('faculties_tb').delete().eq('id', form.data.id);

    if (error) {
      return fail(400, { form, msg: error.message });
    }

    return { form, msg: 'Faculty deleted successfully' };
  }
};

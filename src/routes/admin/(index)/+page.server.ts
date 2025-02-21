import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createDepSchema, updateDepSchema, deleteDepSchema } from './components/forms/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getDepartments = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase.from('departments').select('*').order('created_at');
  };

  return {
    createDepartmentForm: await superValidate(zod(createDepSchema)),
    editDepartmentForm: await superValidate(zod(updateDepSchema)),
    deleteDepartmentForm: await superValidate(zod(deleteDepSchema))
  };
};

export const actions: Actions = {
  createDepEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createDepSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  updateDepEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updateDepSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteDepEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteDepSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

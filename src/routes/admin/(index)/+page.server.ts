import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createDepSchema, updateDepSchema, deleteDepSchema } from './components/forms/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createDepartmentForm: await superValidate(zod(createDepSchema)),
    editDepartmentForm: await superValidate(zod(updateDepSchema)),
    deleteDepartmentForm: await superValidate(zod(deleteDepSchema))
  };
};

export const actions: Actions = {
  createDepEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(createDepSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('deparments_tb').insert({
      code: form.data.code,
      name: form.data.name,
      color: form.data.color
    });

    if (error) return fail(400, { form, msg: error.message });

    return { form, msg: 'Department created successfully.' };
  },

  updateDepEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateDepSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase
      .from('deparments_tb')
      .update({
        code: form.data.code,
        name: form.data.name,
        color: form.data.color
      })
      .eq('id', form.data.id);

    if (error) return fail(400, { form, msg: error.message });

    return { form, msg: 'Department updated successfully.' };
  },

  deleteDepEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteDepSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('deparments_tb').delete().eq('id', form.data.id);

    if (error) return fail(400, { form, msg: error.message });

    return { form, msg: 'Department deleted successfully.' };
  }
};

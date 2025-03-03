import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateInfoSchema } from './components/update-information/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    updateInfoForm: await superValidate(zod(updateInfoSchema))
  };
};

export const actions: Actions = {
  updateInfoEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateInfoSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.updateUser({
      data: {
        firstname: form.data.firstname,
        middlename: form.data.middlename,
        lastname: form.data.lastname,
        birth_date: form.data.birth_date,
        gender: form.data.gender
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Information updated successfully' };
  }
};

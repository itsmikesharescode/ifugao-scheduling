import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updatePasswordSchema } from './components/update-password/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    updatePassForm: await superValidate(zod(updatePasswordSchema))
  };
};

export const actions: Actions = {
  updatePassEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.updateUser({
      password: form.data.password
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Password updated successfully' };
  }
};

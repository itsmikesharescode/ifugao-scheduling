import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateEmailSchema } from './components/update-email/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    updateEmailForm: await superValidate(zod(updateEmailSchema))
  };
};

export const actions: Actions = {
  updateEmailEvent: async ({ request, locals: { supabaseAdmin, user } }) => {
    const form = await superValidate(request, zod(updateEmailSchema));

    if (!form.valid || !user) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email: form.data.email,
      user_metadata: {
        email: form.data.email
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Email updated successfully' };
  }
};

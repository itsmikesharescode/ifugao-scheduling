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
  updateEmailEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updateEmailSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

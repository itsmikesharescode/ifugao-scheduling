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
  updatePassEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

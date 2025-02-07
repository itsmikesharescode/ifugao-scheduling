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
  updateInfoEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updateInfoSchema));

    if (!form.valid) return fail(400, { form });
    console.log(form.data);
  }
};

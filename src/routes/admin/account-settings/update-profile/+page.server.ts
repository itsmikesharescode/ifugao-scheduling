import { superValidate, withFiles } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateProfileSchema } from './components/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    updateProfileForm: await superValidate(zod(updateProfileSchema))
  };
};

export const actions: Actions = {
  updateProfileEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updateProfileSchema));

    if (!form.valid) return fail(400, withFiles({ form }));

    console.log(form.data);
  }
};

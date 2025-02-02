import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createSubjectSchema } from './components/create-subject/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createSubjectForm: await superValidate(zod(createSubjectSchema))
  };
};

export const actions: Actions = {
  createSubjectEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createSubjectSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

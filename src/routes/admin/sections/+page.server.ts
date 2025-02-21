import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createSecSchema, updateSecSchema, deleteSecSchema } from './components/forms/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createSecForm: await superValidate(zod(createSecSchema)),
    updateSecForm: await superValidate(zod(updateSecSchema)),
    deleteSecForm: await superValidate(zod(deleteSecSchema))
  };
};

export const actions: Actions = {
  createSecEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createSecSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  updateSecEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updateSecSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteSecEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSecSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

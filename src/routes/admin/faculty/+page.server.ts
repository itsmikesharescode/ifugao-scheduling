import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createFacSchema, updateFacSchema, deleteFacSchema } from './components/forms/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createFacForm: await superValidate(zod(createFacSchema)),
    updateFacForm: await superValidate(zod(updateFacSchema)),
    deleteFacForm: await superValidate(zod(deleteFacSchema))
  };
};

export const actions: Actions = {
  createFacEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createFacSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log(form.data);
  },

  updateFacEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updateFacSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log(form.data);
  },

  deleteFacEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteFacSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log(form.data);
  }
};

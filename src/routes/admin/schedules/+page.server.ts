import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { createSchedSchema, updateSchedSchema, deleteSchedSchema } from './components/forms/schema';

export const load: PageServerLoad = async () => {
  return {
    createSchedForm: await superValidate(zod(createSchedSchema)),
    updateSchedForm: await superValidate(zod(updateSchedSchema)),
    deleteSchedForm: await superValidate(zod(deleteSchedSchema))
  };
};

export const actions: Actions = {
  createSchedEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createSchedSchema));
    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  updateSchedEvent: async ({ request }) => {
    const form = await superValidate(request, zod(updateSchedSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteSchedEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSchedSchema));
    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createSectionSchema } from './components/create-section/schema';
import { fail } from '@sveltejs/kit';
import { editSectionSchema } from './components/edit-section/schema';
import { deleteSectionSchema } from './components/delete-section/schema';

export const load: PageServerLoad = async () => {
  return {
    createSectionForm: await superValidate(zod(createSectionSchema)),
    editSectionForm: await superValidate(zod(editSectionSchema)),
    deleteSectionForm: await superValidate(zod(deleteSectionSchema))
  };
};

export const actions: Actions = {
  createSectionEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createSectionSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editSectionEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editSectionSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteSectionEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSectionSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

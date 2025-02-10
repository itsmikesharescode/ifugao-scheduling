import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
  createSubjectSchema,
  editSubjectSchema,
  deleteSubjectSchema
} from './components/create-edit-delete-subject/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createSubjectForm: await superValidate(zod(createSubjectSchema)),
    editSubjectForm: await superValidate(zod(editSubjectSchema)),
    deleteSubjectForm: await superValidate(zod(deleteSubjectSchema))
  };
};

export const actions: Actions = {
  createSubjectEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createSubjectSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editSubjectEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editSubjectSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteSubjectEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSubjectSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

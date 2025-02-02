import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createDepartmentSchema } from './components/create-department/schema';
import { fail } from '@sveltejs/kit';
import { editDepartmentSchema } from './components/edit-department/schema';
import { deleteSubjectSchema } from './components/delete-subject/schema';

export const load: PageServerLoad = async () => {
  return {
    createDepartmentForm: await superValidate(zod(createDepartmentSchema)),
    editDepartmentForm: await superValidate(zod(editDepartmentSchema)),
    deleteSubjectForm: await superValidate(zod(deleteSubjectSchema))
  };
};

export const actions: Actions = {
  createDepartmentEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createDepartmentSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editDepartmentEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editDepartmentSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteSubjectEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSubjectSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

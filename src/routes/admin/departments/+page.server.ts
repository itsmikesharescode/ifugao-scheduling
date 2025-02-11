import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
  createDepartmentSchema,
  editDepartmentSchema,
  deleteDepartmentSchema
} from './components/create-edit-delete-department/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createDepartmentForm: await superValidate(zod(createDepartmentSchema)),
    editDepartmentForm: await superValidate(zod(editDepartmentSchema)),
    deleteDepartmentForm: await superValidate(zod(deleteDepartmentSchema))
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

  deleteDepartmentEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteDepartmentSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

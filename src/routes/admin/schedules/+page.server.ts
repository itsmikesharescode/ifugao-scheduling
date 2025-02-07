import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { editDepartmentSchema } from './components/edit-department/schema';
import { deleteDepartmentSchema } from './components/delete-department/schema';
import { createScheduleSchema } from './components/create-schedule/schema';

export const load: PageServerLoad = async () => {
  return {
    createScheduleForm: await superValidate(zod(createScheduleSchema)),
    editDepartmentForm: await superValidate(zod(editDepartmentSchema)),
    deleteDepartmentForm: await superValidate(zod(deleteDepartmentSchema))
  };
};

export const actions: Actions = {
  createScheduleEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createScheduleSchema));
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

import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import {
  createScheduleSchema,
  editScheduleSchema,
  deleteScheduleSchema
} from './components/create-edit-delete-schedule/schema';

export const load: PageServerLoad = async () => {
  return {
    createScheduleForm: await superValidate(zod(createScheduleSchema)),
    editScheduleForm: await superValidate(zod(editScheduleSchema)),
    deleteScheduleForm: await superValidate(zod(deleteScheduleSchema))
  };
};

export const actions: Actions = {
  createScheduleEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createScheduleSchema));
    console.log(form.data);
    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editScheduleEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editScheduleSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteScheduleEvent: async ({ request }) => {
    const form = await superValidate(request, zod(deleteScheduleSchema));
    console.log(form.data);
    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

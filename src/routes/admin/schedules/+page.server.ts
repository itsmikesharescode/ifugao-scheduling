import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { editScheduleSchema } from './components/edit-schedule/schema';
import { deleteScheduleSchema } from './components/delete-schedule/schema';
import { createScheduleSchema } from './components/create-schedule/schema';

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

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createAccountSchema } from './components/create-account/schema';
import { fail } from '@sveltejs/kit';
import {
  editEmailSchema,
  editInformationSchema,
  editPasswordSchema
} from './components/edit-account/components/schema';

export const load: PageServerLoad = async () => {
  return {
    createAccountForm: await superValidate(zod(createAccountSchema)),
    editEmailForm: await superValidate(zod(editEmailSchema)),
    editInformationForm: await superValidate(zod(editInformationSchema)),
    editPasswordForm: await superValidate(zod(editPasswordSchema))
  };
};

export const actions: Actions = {
  createAccountEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createAccountSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editEmailEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editEmailSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editInformationEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editInformationSchema));
    console.log(form.data);
    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editPasswordEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editPasswordSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  deleteAccountEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editPasswordSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

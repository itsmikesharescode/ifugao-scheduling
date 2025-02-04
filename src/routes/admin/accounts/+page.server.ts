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
import { editOperationalSchema } from './components/edit-operational/schema';
import { deleteAccountSchema } from './components/delete-account/schema';

export const load: PageServerLoad = async () => {
  return {
    createAccountForm: await superValidate(zod(createAccountSchema)),
    editOperationalForm: await superValidate(zod(editOperationalSchema)),
    editEmailForm: await superValidate(zod(editEmailSchema)),
    editInformationForm: await superValidate(zod(editInformationSchema)),
    editPasswordForm: await superValidate(zod(editPasswordSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema))
  };
};

export const actions: Actions = {
  createAccountEvent: async ({ request }) => {
    const form = await superValidate(request, zod(createAccountSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editOperationalEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editOperationalSchema));

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
    const form = await superValidate(request, zod(deleteAccountSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};

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
import { deleteAccountSchema } from './components/delete-account/schema';

export const load: PageServerLoad = async () => {
  return {
    createAccountForm: await superValidate(zod(createAccountSchema)),
    editEmailForm: await superValidate(zod(editEmailSchema)),
    editInformationForm: await superValidate(zod(editInformationSchema)),
    editPasswordForm: await superValidate(zod(editPasswordSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema))
  };
};

export const actions: Actions = {
  createAccountEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(createAccountSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: form.data.email,
      password: form.data.password,
      email_confirm: true,
      user_metadata: {
        role_id: '55d8bf75-4471-493f-ae1e-8ef1e1b65242',
        status: form.data.status,
        firstname: form.data.firstname,
        middlename: form.data.middlename,
        lastname: form.data.lastname,
        academic_rank: form.data.academic_rank,
        birth_date: form.data.birth_date,
        departments: form.data.departments,
        gender: form.data.gender
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Account created successfully' };
  },

  editEmailEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editEmailSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  editInformationEvent: async ({ request }) => {
    const form = await superValidate(request, zod(editInformationSchema));
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

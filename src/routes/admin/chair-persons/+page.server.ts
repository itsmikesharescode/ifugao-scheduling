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

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getUsers = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase.from('users_tb').select('*').order('created_at');
    if (error) return null;

    return data;
  };

  return {
    createAccountForm: await superValidate(zod(createAccountSchema)),
    editEmailForm: await superValidate(zod(editEmailSchema)),
    editInformationForm: await superValidate(zod(editInformationSchema)),
    editPasswordForm: await superValidate(zod(editPasswordSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
    users: await getUsers()
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
        email: form.data.email,
        firstname: form.data.firstname,
        middlename: form.data.middlename,
        lastname: form.data.lastname,
        academic_rank: form.data.academic_rank,
        birth_date: form.data.birth_date,
        departments: form.data.departments,
        gender: form.data.gender,
        status: form.data.status
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Account created successfully' };
  },

  editEmailEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(editEmailSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
      email: form.data.email,
      user_metadata: {
        email: form.data.email
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Email updated successfully' };
  },

  editInformationEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(editInformationSchema));
    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
      user_metadata: {
        firstname: form.data.firstname,
        middlename: form.data.middlename,
        lastname: form.data.lastname,
        academic_rank: form.data.academic_rank,
        birth_date: form.data.birth_date,
        departments: form.data.departments,
        gender: form.data.gender,
        status: form.data.status
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Information updated successfully' };
  },

  editPasswordEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(editPasswordSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
      password: form.data.password
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Password updated successfully' };
  },

  deleteAccountEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(deleteAccountSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.deleteUser(form.data.user_id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Account deleted successfully' };
  }
};

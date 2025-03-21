import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './components/login/schema';
import { registerSchema } from './components/register/schema';
import { forgotPasswordSchema } from './components/forgot-password/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    loginForm: await superValidate(zod(loginSchema)),
    registerForm: await superValidate(zod(registerSchema)),
    forgotPasswordForm: await superValidate(zod(forgotPasswordSchema))
  };
};

export const actions: Actions = {
  loginEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) return fail(401, { form });

    const { error } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Login successful' };
  },

  registerEvent: async ({ request }) => {
    const form = await superValidate(request, zod(registerSchema));

    if (!form.valid) return fail(401, { form });

    console.log(form.data);
  },

  forgotPasswordEvent: async ({ request }) => {
    const form = await superValidate(request, zod(forgotPasswordSchema));

    if (!form.valid) return fail(401, { form });

    console.log(form.data);
  }
};

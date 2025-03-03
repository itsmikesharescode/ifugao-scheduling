import { superValidate, withFiles } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateProfileSchema } from './components/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    updateProfileForm: await superValidate(zod(updateProfileSchema))
  };
};

export const actions: Actions = {
  updateProfileEvent: async ({ request, locals: { supabase, user } }) => {
    const form = await superValidate(request, zod(updateProfileSchema));

    if (!form.valid || !user) return fail(400, withFiles({ form }));

    const { data: storageData, error: storageError } = await supabase.storage
      .from('profile_bucket')
      .upload(user.id, form.data.profile, {
        cacheControl: '3600',
        upsert: true
      });

    if (storageError) return fail(401, withFiles({ form, error: storageError.message }));

    const { error: userError } = await supabase.auth.updateUser({
      data: {
        avatar_path: storageData.fullPath
      }
    });

    if (userError) return fail(401, withFiles({ form, error: userError.message }));

    return withFiles({ form, msg: 'Profile updated successfully' });
  }
};

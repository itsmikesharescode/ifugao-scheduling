<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updateProfileSchema, type UpdateProfileSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  import UppyUploader from '$lib/components/uppy-uploader/uppy-uploader.svelte';

  interface Props {
    updateProfileForm: SuperValidated<Infer<UpdateProfileSchema>>;
  }

  const { updateProfileForm }: Props = $props();

  const form = superForm(updateProfileForm, {
    validators: zodClient(updateProfileSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success(data.msg);
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const file = fileProxy(form, 'profile');
</script>

<div class="flex flex-col gap-10">
  <form method="POST" action="?/updateProfileEvent" enctype="multipart/form-data" use:enhance>
    <Form.Field {form} name="profile">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Profile Photo</Form.Label>
          <UppyUploader
            dimensions={{ height: 300, width: '100%' }}
            onFileChanges={(v) => {
              $formData.profile = v;
            }}
          />
          <input type="file" name="profile" bind:files={$file} class="hidden" />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <div class="flex justify-end">
      <Form.Button disabled={$submitting} class="relative">
        {#if $submitting}
          <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
            <LoaderCircle class="animate-spin" />
          </div>
        {/if}
        Update Profile
      </Form.Button>
    </div>
  </form>

  <div class="space-y-1 rounded-lg bg-muted/20 p-3 text-center text-xs text-muted-foreground">
    <p>🖼️ Accepted formats: JPG, PNG, WebP</p>
    <p>✅ Recommended: Square ratio, max 1024x1024px</p>
    <p>❌ Not allowed: Images larger than 2MB</p>
  </div>
</div>

<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { toast } from 'svelte-sonner';
  import { updateProfileSchema, type UpdateProfileSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import UppyUploader from '$lib/components/uppy-uploader/uppy-uploader.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';
  import { PUBLIC_SUPABASE_STORAGE_URL } from '$env/static/public';
  interface Props {
    updateProfileForm: SuperValidated<Infer<UpdateProfileSchema>>;
  }

  const { updateProfileForm }: Props = $props();
  let editState = $state(false);

  const form = superForm(updateProfileForm, {
    validators: zodClient(updateProfileSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success(data.msg);
          editState = false;
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

{#if !editState}
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Label>Current Profile Photo</Label>
      <Avatar.Root class="size-80 rounded-lg">
        <Avatar.Image
          src={`${PUBLIC_SUPABASE_STORAGE_URL}/${page.data.user?.user_metadata.avatar_path}?t=${new Date()}`}
          alt="@shadcn"
          class="size-80 rounded-lg"
        />
        <Avatar.Fallback class="size-80 rounded-lg">CN</Avatar.Fallback>
      </Avatar.Root>
    </div>

    <Button variant="secondary" onclick={() => (editState = true)} class="ml-auto"
      >Edit Profile Photo</Button
    >
  </div>
{:else}
  <div class="flex flex-col gap-10">
    <form method="POST" action="?/updateProfileEvent" enctype="multipart/form-data" use:enhance>
      <Form.Field {form} name="profile">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Profile Photo</Form.Label>
            <UppyUploader
              dimensions={{ height: 320, width: '320px' }}
              onFileChanges={(v) => {
                $formData.profile = v;
              }}
            />
            <input type="file" name="profile" bind:files={$file} class="hidden" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <div class="flex items-center justify-between">
        <Button variant="secondary" onclick={() => (editState = false)}>Back</Button>
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
{/if}

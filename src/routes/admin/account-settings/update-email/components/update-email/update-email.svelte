<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updateEmailSchema, type UpdateEmailSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Label from '$lib/components/ui/label/label.svelte';
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  interface Props {
    updateEmailForm: SuperValidated<Infer<UpdateEmailSchema>>;
  }

  const { updateEmailForm }: Props = $props();
  const user = $derived(page.data.user);
  let editState = $state(false);
  const form = superForm(updateEmailForm, {
    validators: zodClient(updateEmailSchema),
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

  $effect(() => {
    if (editState) {
      $formData.email = user?.email ?? '';
    }
  });
</script>

{#snippet labelTemplate({ label, value }: { label: string; value: string })}
  <div class="flex flex-col gap-2">
    <Label>{label}</Label>
    <span
      class="md:text-sm' flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {value}
    </span>
  </div>
{/snippet}

{#if !editState}
  <div class="flex flex-col gap-4">
    {@render labelTemplate({ label: 'Email', value: user?.email ?? '' })}

    <Button onclick={() => (editState = true)} variant="secondary" class="ml-auto w-fit"
      >Edit Email</Button
    >
  </div>
{:else}
  <form method="POST" action="?/updateEmailEvent" use:enhance>
    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input {...props} bind:value={$formData.email} placeholder="Enter your new email" />
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
        Update Email
      </Form.Button>
    </div>
  </form>

  <!-- <span class="text-center text-xs text-muted-foreground">
    A confirmation email will be sent to your old email to allow the change to the new email.
  </span> -->
{/if}

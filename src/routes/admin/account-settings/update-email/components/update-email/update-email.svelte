<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updateEmailSchema, type UpdateEmailSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  interface Props {
    updateEmailForm: SuperValidated<Infer<UpdateEmailSchema>>;
  }

  const { updateEmailForm }: Props = $props();

  const form = superForm(updateEmailForm, {
    validators: zodClient(updateEmailSchema),
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
</script>

<div class="flex flex-col gap-10">
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

    <div class="flex justify-end">
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

  <span class="text-center text-sm text-muted-foreground">
    A confirmation email will be sent to your old email to allow the change to the new email.
  </span>
</div>

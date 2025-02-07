<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updatePasswordSchema, type UpdatePasswordSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  interface Props {
    updatePassForm: SuperValidated<Infer<UpdatePasswordSchema>>;
  }

  const { updatePassForm }: Props = $props();

  const form = superForm(updatePassForm, {
    validators: zodClient(updatePasswordSchema),
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
  <form method="POST" action="?/updatePassEvent" use:enhance>
    <Form.Field {form} name="password">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Password</Form.Label>
          <Input
            type="password"
            {...props}
            bind:value={$formData.password}
            placeholder="Enter your new password"
          />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="confirmPassword">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Confirm Password</Form.Label>
          <Input
            type="password"
            {...props}
            bind:value={$formData.confirmPassword}
            placeholder="Confirm your new password"
          />
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
        Update Password
      </Form.Button>
    </div>
  </form>
</div>

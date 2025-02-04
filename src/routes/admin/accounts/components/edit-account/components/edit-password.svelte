<script lang="ts">
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { editPasswordSchema, type EditPasswordSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../../table/state.svelte';

  interface Props {
    editPasswordForm: SuperValidated<Infer<EditPasswordSchema>>;
  }

  const { editPasswordForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(editPasswordForm, {
    validators: zodClient(editPasswordSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.showUpdate = false;
          tableState.setActiveRow(null);
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    $formData.user_id = tableState.getActiveRow()?.user_id ?? '';

    return () => {
      form.reset();
    };
  });
</script>

<form method="POST" action="?/editPasswordEvent" use:enhance>
  <input name="user_id" type="hidden" bind:value={$formData.user_id} />
  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Password</Form.Label>
        <Input
          type="password"
          {...props}
          bind:value={$formData.password}
          placeholder="Enter new password"
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
          placeholder="Confirm new password"
        />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="flex justify-end">
    <Form.Button disabled={$submitting} class="relative">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <Loader class="animate-spin" />
        </div>
      {/if}
      Update Password
    </Form.Button>
  </div>
</form>

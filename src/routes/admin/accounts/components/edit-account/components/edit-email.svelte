<script lang="ts">
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { editEmailSchema, type EditEmailSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../../table/state.svelte';

  interface Props {
    editEmailForm: SuperValidated<Infer<EditEmailSchema>>;
  }

  const { editEmailForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(editEmailForm, {
    validators: zodClient(editEmailSchema),
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
    if (tableState.showUpdate) {
      $formData.user_id = tableState.getActiveRow()?.user_id ?? '';
      $formData.email = tableState.getActiveRow()?.email ?? '';
      return () => {
        form.reset();
      };
    }
  });
</script>

<form method="POST" action="?/editEmailEvent" use:enhance>
  <input name="user_id" type="hidden" bind:value={$formData.user_id} />
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Input {...props} bind:value={$formData.email} placeholder="Enter new email" />
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
      Update Email
    </Form.Button>
  </div>
</form>

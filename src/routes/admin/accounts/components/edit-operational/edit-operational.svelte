<script lang="ts">
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { editOperationalSchema, type EditOperationalSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/state.svelte';
  import SelectPicker from '$lib/components/select-picker/select-picker.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';

  interface Props {
    editOperationalForm: SuperValidated<Infer<EditOperationalSchema>>;
  }

  const { editOperationalForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(editOperationalForm, {
    validators: zodClient(editOperationalSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          tableState.showOperational = false;
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (tableState.showOperational) {
      $formData.user_id = tableState.getActiveRow()?.user_id ?? '';
      $formData.operational = tableState.getActiveRow()?.operational ?? '';
      return () => {
        form.reset();
      };
    }
  });
</script>

<Dialog.Root
  open={tableState.showOperational}
  onOpenChange={() => {
    tableState.showOperational = false;
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Operational</Dialog.Title>

      <form method="POST" action="?/editOperationalEvent" use:enhance>
        <input name="user_id" type="hidden" bind:value={$formData.user_id} />
        <Form.Field {form} name="operational">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Operational</Form.Label>
              <SelectPicker
                selections={[
                  { id: crypto.randomUUID(), name: 'Pending', value: 'pending' },
                  { id: crypto.randomUUID(), name: 'Activated', value: 'activated' }
                ]}
                bind:selected={$formData.operational}
                placeholder="Select operational"
              />
              <input name={props.name} type="hidden" bind:value={$formData.operational} />
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
            Edit
          </Form.Button>
        </div>
      </form>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { editDepartmentSchema, type EditDepartmentSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/state.svelte';

  interface Props {
    editDepartmentForm: SuperValidated<Infer<EditDepartmentSchema>>;
  }

  const { editDepartmentForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(editDepartmentForm, {
    validators: zodClient(editDepartmentSchema),
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
      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.department_code = tableState.getActiveRow()?.department_code ?? '';
      $formData.name = tableState.getActiveRow()?.name ?? '';
      $formData.color = tableState.getActiveRow()?.color ?? '';

      return () => {};
    }
  });
</script>

<Dialog.Root
  bind:open={tableState.showUpdate}
  onOpenChange={() => {
    tableState.showUpdate = false;
    form.reset();
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Department</Dialog.Title>
      <Dialog.Description>Kindly answer the field to edit the department.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/editDepartmentEvent" use:enhance>
      <input name="id" type="hidden" bind:value={$formData.id} />
      <Form.Field {form} name="department_code">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Code</Form.Label>
            <Input
              {...props}
              bind:value={$formData.department_code}
              placeholder="Enter department code"
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Name</Form.Label>
            <Input {...props} bind:value={$formData.name} placeholder="Enter department name" />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="color">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Color</Form.Label>
            <Input
              type="color"
              {...props}
              bind:value={$formData.color}
              placeholder="Enter department color"
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
          Edit Department
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

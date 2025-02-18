<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import {
    createDepartmentSchema,
    editDepartmentSchema,
    deleteDepartmentSchema,
    type CreateDepartmentSchema,
    type EditDepartmentSchema,
    type DeleteDepartmentSchema
  } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { urlParamReducer } from '$lib/utils';
  import { goto } from '$app/navigation';
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { useTableState } from '../table/state.svelte';
  interface Props {
    createDepartmentForm: SuperValidated<Infer<CreateDepartmentSchema>>;
    editDepartmentForm: SuperValidated<Infer<EditDepartmentSchema>>;
    deleteDepartmentForm: SuperValidated<Infer<DeleteDepartmentSchema>>;
    mode: 'create' | 'edit' | 'delete';
    open: boolean;
  }

  const { createDepartmentForm, editDepartmentForm, deleteDepartmentForm, mode, open }: Props =
    $props();

  const tableState = useTableState();

  const formSchemes = {
    forms: {
      create: createDepartmentForm,
      edit: editDepartmentForm,
      delete: deleteDepartmentForm
    },

    schemas: {
      create: createDepartmentSchema,
      edit: editDepartmentSchema,
      delete: deleteDepartmentSchema
    },

    formIds: {
      create: 'create-department-form',
      edit: 'edit-department-form',
      delete: 'delete-department-form'
    },
    endPoints: {
      create: '?/createDepartmentEvent',
      edit: '?/editDepartmentEvent',
      delete: '?/deleteDepartmentEvent'
    }
  };

  const form = superForm(formSchemes.forms[mode] as any, {
    validators: zodClient(formSchemes.schemas[mode]),
    id: formSchemes.formIds[mode],
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

  $effect(() => {
    if (!open) return;

    if (mode !== 'create') {
      const activeRow = tableState.getActiveRow();
      if (activeRow) {
        $formData.id = activeRow?.id ?? 0;
        $formData.department_code = activeRow?.department_code ?? '';
        $formData.name = activeRow?.name ?? '';
        $formData.color = activeRow?.color ?? '';

        return () => {};
      }

      goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
    }
  });
</script>

{#snippet modeTemplate({
  createMsg,
  editMsg,
  deleteMsg
}: {
  createMsg: string;
  editMsg: string;
  deleteMsg: string;
})}
  {#if mode === 'create'}
    {createMsg}
  {:else if mode === 'edit'}
    {editMsg}
  {:else}
    {deleteMsg}
  {/if}
{/snippet}

<Dialog.Root
  {open}
  onOpenChange={() => {
    form.reset();
    tableState.setActiveRow(null);
    goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>
        {@render modeTemplate({
          createMsg: 'Create Department',
          editMsg: 'Edit Department',
          deleteMsg: 'Delete Department'
        })}
      </Dialog.Title>
      <Dialog.Description>
        {@render modeTemplate({
          createMsg: 'Kindly answer the field to create department.',
          editMsg: 'Kindly answer the field to edit department.',
          deleteMsg: 'Press delete to delete this department.'
        })}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action={formSchemes.endPoints[mode]} use:enhance>
      {#if mode !== 'create'}
        <input name="id" type="hidden" bind:value={$formData.id} />
      {/if}
      {#if mode !== 'delete'}
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
                placeholder="Enter department name"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      {/if}
      <div class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <Loader class="animate-spin" />
            </div>
          {/if}
          {@render modeTemplate({
            createMsg: 'Create',
            editMsg: 'Edit',
            deleteMsg: 'Delete'
          })}
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

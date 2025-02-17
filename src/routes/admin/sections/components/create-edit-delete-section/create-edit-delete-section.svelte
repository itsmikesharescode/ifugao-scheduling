<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/state.svelte';
  import { goto } from '$app/navigation';
  import {
    createSectionSchema,
    editSectionSchema,
    deleteSectionSchema,
    type CreateSectionSchema,
    type DeleteSectionSchema,
    type EditSectionSchema
  } from './schema';
  import { urlParamReducer } from '$lib/utils';
  import { page } from '$app/state';
  import DepartmentPicker, {
    sampleDeps
  } from '$lib/components/select-picker/department-picker.svelte';

  interface Props {
    createSectionForm: SuperValidated<Infer<CreateSectionSchema>>;
    editSectionForm: SuperValidated<Infer<EditSectionSchema>>;
    deleteSectionForm: SuperValidated<Infer<DeleteSectionSchema>>;
    open: boolean;
    mode: 'create' | 'edit' | 'delete';
  }

  const schemas = {
    create: createSectionSchema,
    edit: editSectionSchema,
    delete: deleteSectionSchema
  };

  const formIds = {
    create: 'create-section-form',
    edit: 'edit-section-form',
    delete: 'delete-section-form'
  };

  const endPoints = {
    create: '?/createSectionEvent',
    edit: '?/editSectionEvent',
    delete: '?/deleteSectionEvent'
  };
</script>

<script lang="ts">
  const { open, mode, createSectionForm, editSectionForm, deleteSectionForm }: Props = $props();

  const tableState = useTableState();

  const forms = {
    create: createSectionForm,
    edit: editSectionForm,
    delete: deleteSectionForm
  };

  const form = superForm(forms[mode] as any, {
    validators: zodClient(schemas[mode]),
    id: formIds[mode],
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
        $formData.name = activeRow.name;
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
          createMsg: 'Create Section',
          editMsg: 'Edit Section',
          deleteMsg: 'Delete Section'
        })}
      </Dialog.Title>
      <Dialog.Description>
        {@render modeTemplate({
          createMsg: 'Kindly answer the field to create a section.',
          editMsg: 'Kindly answer the field to edit a section.',
          deleteMsg: 'Press delete to delete a section.'
        })}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action={endPoints[mode]} use:enhance>
      {#if tableState.getActiveRow() && mode !== 'create'}
        <input name="id" type="hidden" value={tableState.getActiveRow()?.id} />
      {/if}

      {#if mode !== 'delete'}
        <Form.Field {form} name="name">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Section Name</Form.Label>
              <Input {...props} bind:value={$formData.name} placeholder="Enter section name" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="departments">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Departments</Form.Label>
              <DepartmentPicker
                mode="multiple"
                departments={sampleDeps}
                bind:selected={
                  () => {
                    return {
                      single: undefined,
                      multiple: $formData.departments as number[]
                    };
                  },
                  (v) => ($formData.departments = v.multiple)
                }
              />
              <input name={props.name} type="hidden" bind:value={$formData.departments} />
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

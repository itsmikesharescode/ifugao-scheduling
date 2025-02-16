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
  import { page } from '$app/state';

  interface Props {
    open: boolean;
    createSubjectForm: SuperValidated<Infer<CreateSubjectSchema>>;
    editSubjectForm: SuperValidated<Infer<EditSubjectSchema>>;
    deleteSubjectForm: SuperValidated<Infer<DeleteSubjectSchema>>;
    mode: 'create' | 'edit' | 'delete';
  }
  import {
    createSubjectSchema,
    deleteSubjectSchema,
    editSubjectSchema,
    type CreateSubjectSchema,
    type DeleteSubjectSchema,
    type EditSubjectSchema
  } from './schema';
  import { urlParamReducer } from '$lib/utils';
  import DepartmentPicker, {
    sampleDeps
  } from '$lib/components/select-picker/department-picker.svelte';

  const schemas = {
    create: createSubjectSchema,
    edit: editSubjectSchema,
    delete: deleteSubjectSchema
  };

  const formIds = {
    create: 'create-subject-form',
    edit: 'edit-subject-form',
    delete: 'delete-subject-form'
  };

  const endPoints = {
    create: '?/createSubjectEvent',
    edit: '?/editSubjectEvent',
    delete: '?/deleteSubjectEvent'
  };
</script>

<script lang="ts">
  const { open, createSubjectForm, editSubjectForm, deleteSubjectForm, mode }: Props = $props();

  const forms = {
    create: createSubjectForm,
    edit: editSubjectForm,
    delete: deleteSubjectForm
  };

  let tableState = useTableState();

  const form = superForm(forms[mode] as any, {
    validators: zodClient(schemas[mode]),
    dataType: 'json',
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
  } satisfies Parameters<typeof superForm>[1]);

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (!open) return;

    if (mode !== 'create') {
      const activeRow = tableState.getActiveRow();
      if (activeRow) {
        $formData.course_code = activeRow.course_code;
        $formData.name = activeRow.name;
        $formData.departments = activeRow.departments;
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
          createMsg: 'Create Subject',
          editMsg: 'Edit Subject',
          deleteMsg: 'Delete This Subject?'
        })}
      </Dialog.Title>
      <Dialog.Description>
        {@render modeTemplate({
          createMsg: 'Kindly answer the field to create a subject.',
          editMsg: 'Kindly answer the field to edit a subject.',
          deleteMsg: 'Press delete to delete this subject'
        })}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action={endPoints[mode]} use:enhance>
      {#if tableState.getActiveRow() && mode !== 'create'}
        <input name="id" type="hidden" value={tableState.getActiveRow()?.id} />
      {/if}

      {#if mode !== 'delete'}
        <Form.Field {form} name="course_code">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Course Code</Form.Label>
              <Input
                {...props}
                bind:value={$formData.course_code}
                placeholder="Enter course code"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="name">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Course Name</Form.Label>
              <Input {...props} bind:value={$formData.name} placeholder="Enter course name" />
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
                  (v) => {
                    $formData.departments = v.multiple;
                    console.log($formData.departments, 'aw');
                  }
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
          {@render modeTemplate({ createMsg: 'Create', editMsg: 'Edit', deleteMsg: 'Delete' })}
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

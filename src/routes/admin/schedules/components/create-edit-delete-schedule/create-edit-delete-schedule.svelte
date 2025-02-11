<script lang="ts" module>
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Trash2 from 'lucide-svelte/icons/trash-2';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import {
    createScheduleSchema,
    editScheduleSchema,
    deleteScheduleSchema,
    type CreateScheduleSchema,
    type EditScheduleSchema,
    type DeleteScheduleSchema
  } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import SelectPicker from '$lib/components/select-picker/select-picker.svelte';
  import SubjectPicker, { sampleSubs } from '$lib/components/select-picker/subject-picker.svelte';
  import SectionPicker, { sampleSecs } from '$lib/components/select-picker/section-picker.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { tick } from 'svelte';
  import { useTableState } from '../table/state.svelte';

  const schemas = {
    create: createScheduleSchema,
    edit: editScheduleSchema,
    delete: deleteScheduleSchema
  };

  const endPoints = {
    create: '?/createScheduleEvent',
    edit: '?/editScheduleEvent',
    delete: '?/deleteScheduleEvent'
  };
</script>

<script lang="ts">
  import DepartmentPicker, {
    sampleDeps
  } from '$lib/components/select-picker/department-picker.svelte';
  import { urlParamReducer } from '$lib/utils';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  interface Props {
    createScheduleForm: SuperValidated<Infer<CreateScheduleSchema>>;
    editScheduleForm: SuperValidated<Infer<EditScheduleSchema>>;
    deleteScheduleForm: SuperValidated<Infer<DeleteScheduleSchema>>;
    mode: 'create' | 'edit' | 'delete';
    open: boolean;
  }

  const { open, createScheduleForm, editScheduleForm, deleteScheduleForm, mode }: Props = $props();

  const tableState = useTableState();

  const forms = {
    create: createScheduleForm,
    edit: editScheduleForm,
    delete: deleteScheduleForm
  };

  const form = superForm(forms[mode] as any, {
    validators: zodClient(schemas[mode]),
    id: crypto.randomUUID(),
    dataType: 'json',
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

  let ref = $state<HTMLElement>();

  const increaseDynamicForm = async () => {
    $formData.dynamic_form = [
      ...$formData.dynamic_form,
      {
        code: '',
        section_id: 0,
        subject_id: 0,
        units: 0,
        num_of_hours: { lecture: 0, lab: 0 }
      }
    ];

    await tick();
    if (ref) {
      ref.scrollTo({
        top: ref.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleDeleteForm = (index: number) => {
    $formData.dynamic_form = $formData.dynamic_form.filter((_: unknown, i: number) => i !== index);
  };

  const resetForm = () => {
    $formData.dynamic_form = [$formData.dynamic_form[0]];
  };

  $effect(() => {
    if (!open) return;
    $formData.dynamic_form = [
      {
        code: '',
        section_id: 0,
        subject_id: 0,
        units: 0,
        num_of_hours: { lecture: 0, lab: 0 }
      }
    ];
    if (mode !== 'create') {
      const activeRow = tableState.getActiveRow();
      if (activeRow) {
        $formData.id = activeRow?.id ?? 0;
        $formData.department_id = activeRow.department_id;
        $formData.dynamic_form = activeRow.dynamic_form;
        $formData.id = activeRow.id;
        $formData.school_year = activeRow.school_year;
        $formData.semester = activeRow.semester;
        $formData.user_id = activeRow.user_id;

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
  <Dialog.Content class="max-h-screen p-0 {mode === 'delete' ? '' : 'max-w-7xl'}">
    <Dialog.Header class="px-6 pt-6">
      <Dialog.Title>
        {@render modeTemplate({
          createMsg: 'Create Schedule',
          editMsg: 'Edit Schedule',
          deleteMsg: 'Delete Schedule'
        })}
      </Dialog.Title>
      <Dialog.Description>
        {@render modeTemplate({
          createMsg: 'Kindly answer the field to create a schedule.',
          editMsg: 'Kindly answer the field to edit a schedule.',
          deleteMsg: 'Press delete to delete this schedule.'
        })}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action={endPoints[mode]} use:enhance class="flex flex-col gap-4">
      {#if tableState.getActiveRow() && mode !== 'create'}
        <input name="id" type="hidden" value={tableState.getActiveRow()?.id} />
      {/if}

      {#if mode !== 'delete'}
        <div class="grid grid-cols-3 items-center gap-4 px-6">
          <Form.Field {form} name="semester">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Semester</Form.Label>
                <SelectPicker
                  selections={[
                    { id: crypto.randomUUID(), name: 'First Semester', value: 'First Semester' },
                    { id: crypto.randomUUID(), name: 'Second Semester', value: 'Second Semester' },
                    { id: crypto.randomUUID(), name: 'Third Semester', value: 'Third Semester' }
                  ]}
                  bind:selected={$formData.semester}
                />
                <input name={props.name} type="hidden" bind:value={$formData.semester} />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="school_year">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>School Year</Form.Label>
                <SelectPicker
                  selections={[
                    { id: crypto.randomUUID(), name: 'First Year', value: 'First Year' },
                    { id: crypto.randomUUID(), name: 'Second Year', value: 'Second Year' },
                    { id: crypto.randomUUID(), name: 'Third Year', value: 'Third Year' },
                    { id: crypto.randomUUID(), name: 'Fourth Year', value: 'Fourth Year' }
                  ]}
                  bind:selected={$formData.school_year}
                />
                <input name={props.name} type="hidden" bind:value={$formData.semester} />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="department_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Department</Form.Label>
                <DepartmentPicker
                  departments={sampleDeps}
                  bind:selected_id={$formData.department_id}
                />
                <input name={props.name} type="hidden" bind:value={$formData.department_id} />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="max-h-[60dvh] overflow-auto px-6" bind:this={ref}>
          <div class="flex flex-col gap-4">
            {#each $formData.dynamic_form as _, index (index)}
              <div class="rounded-lg border-2 bg-secondary/50 p-4">
                <div class="flex items-center justify-between p-2">
                  <span class="text-base font-semibold">Form # {index + 1}</span>
                  {#if $formData.dynamic_form.length > 1}
                    <Button size="sm" variant="destructive" onclick={() => handleDeleteForm(index)}>
                      Delete
                      <Trash2 class="size-4" />
                    </Button>
                  {/if}
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="">
                    <Form.Field {form} name={`dynamic_form[${index}].subject_id`}>
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Subject</Form.Label>
                          <SubjectPicker
                            subjects={sampleSubs}
                            bind:selected_id={$formData.dynamic_form[index].subject_id}
                          />
                          <input
                            name={props.name}
                            type="hidden"
                            bind:value={$formData.dynamic_form[index].subject_id}
                          />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name={`dynamic_form[${index}].section_id`}>
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Section</Form.Label>
                          <SectionPicker
                            sections={sampleSecs}
                            bind:selected_id={$formData.dynamic_form[index].section_id}
                          />
                          <input
                            name={props.name}
                            type="hidden"
                            bind:value={$formData.dynamic_form[index].section_id}
                          />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name={`dynamic_form[${index}].code`}>
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Code</Form.Label>
                          <Input
                            {...props}
                            bind:value={$formData.dynamic_form[index].code}
                            placeholder="Enter code"
                          />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>
                  </div>

                  <div class="">
                    <Form.Field {form} name={`dynamic_form[${index}].units`}>
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Units</Form.Label>
                          <Input
                            type="number"
                            {...props}
                            bind:value={$formData.dynamic_form[index].units}
                            placeholder="Enter units"
                          />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name={`dynamic_form[${index}].num_of_hours.lecture`}>
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Lecture Hours</Form.Label>
                          <Input
                            type="number"
                            {...props}
                            bind:value={$formData.dynamic_form[index].num_of_hours.lecture}
                            placeholder="Enter lecture hours"
                          />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name={`dynamic_form[${index}].num_of_hours.lab`}>
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Laboratory Hours</Form.Label>
                          <Input
                            type="number"
                            {...props}
                            bind:value={$formData.dynamic_form[index].num_of_hours.lab}
                            placeholder="Enter laboratory hours"
                          />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="flex justify-end gap-4 px-6 pb-6">
        {#if mode !== 'delete'}
          {#if $formData.dynamic_form.length > 2}
            <Button variant="secondary" onclick={resetForm}>
              Reset {$formData.dynamic_form.length} Forms
            </Button>
          {/if}
          <Button onclick={increaseDynamicForm}>Increase Form</Button>
        {/if}
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

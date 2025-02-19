<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { urlParamReducer } from '$lib/utils';
  import { updateSubSchema, type UpdateSubSchema } from '../schema';
  import DepartmentPicker, {
    sampleDeps
  } from '$lib/components/select-picker/department-picker.svelte';

  interface Props {
    updateSubForm: SuperValidated<Infer<UpdateSubSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';
  import { useTableState } from '../../table/state.svelte';

  const { updateSubForm }: Props = $props();

  let tableState = useTableState();

  const form = superForm(updateSubForm, {
    validators: zodClient(updateSubSchema),
    dataType: 'json',
    id: crypto.randomUUID(),
    onUpdate: async ({ result }) => {
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

  const open = $derived(page.url.searchParams.get('mode') === 'update');

  $effect(() => {
    if (open) {
      const activeRow = tableState.getActiveRow();

      if (activeRow) {
        $formData.id = activeRow.id;
        $formData.course_code = activeRow.course_code;
        $formData.name = activeRow.name;
        $formData.departments = activeRow.departments;
      } else {
        goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
      }

      return () => {};
    }
  });
</script>

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
      <Dialog.Title>Update Subject</Dialog.Title>
      <Dialog.Description>Kindly answer the field to update a subject.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/updateSubEvent" use:enhance>
      <Form.Field {form} name="course_code">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Course Code</Form.Label>
            <Input {...props} bind:value={$formData.course_code} placeholder="Enter course code" />
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
                (v) => ($formData.departments = v.multiple)
              }
            />
            <input name={props.name} type="hidden" bind:value={$formData.departments} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <div class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          <FormSpinner isLoading={$submitting} />
          Update
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

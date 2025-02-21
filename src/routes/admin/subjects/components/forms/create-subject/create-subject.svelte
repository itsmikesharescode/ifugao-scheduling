<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import DepartmentPicker from '$lib/components/select-picker/department-picker.svelte';
  import { createSubSchema, type CreateSubSchema } from '../schema';
  import { urlParamReducer } from '$lib/utils';

  interface Props {
    createSubForm: SuperValidated<Infer<CreateSubSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';
  import { useTableState } from '../../table/state.svelte';

  const { createSubForm }: Props = $props();

  let tableState = useTableState();

  const form = superForm(createSubForm, {
    validators: zodClient(createSubSchema),
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

  const open = $derived(page.url.searchParams.get('mode') === 'create');
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
      <Dialog.Title>Create Subject</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create a subject.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createSubEvent" use:enhance>
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
              departments={page.data.departments ?? []}
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
          Create
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

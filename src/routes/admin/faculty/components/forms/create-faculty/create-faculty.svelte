<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { createFacSchema, type CreateFacSchema } from '../schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { urlParamReducer } from '$lib/utils';
  import { goto } from '$app/navigation';
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';
  import DepartmentPicker, {
    sampleDeps
  } from '$lib/components/select-picker/department-picker.svelte';
  interface Props {
    createFacForm: SuperValidated<Infer<CreateFacSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';

  const { createFacForm }: Props = $props();

  const form = superForm(createFacForm, {
    validators: zodClient(createFacSchema),
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
    goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Faculty</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create faculty.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createFacEvent" use:enhance>
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
          Create
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

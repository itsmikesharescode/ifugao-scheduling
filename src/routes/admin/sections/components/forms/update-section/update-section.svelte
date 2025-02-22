<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { updateSecSchema, type UpdateSecSchema } from '../schema';
  import { urlParamReducer } from '$lib/utils';
  import DepartmentPicker from '$lib/components/select-picker/department-picker.svelte';

  interface Props {
    updateSecForm: SuperValidated<Infer<UpdateSecSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { useTableState } from '../../table/state.svelte';

  const { updateSecForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateSecForm, {
    validators: zodClient(updateSecSchema),
    id: crypto.randomUUID(),
    dataType: 'json',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          await goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const open = $derived(page.url.searchParams.get('mode') === 'edit');

  $effect(() => {
    const activeRow = tableState.getActiveRow();

    if (open) {
      if (activeRow) {
        $formData.id = activeRow.id;
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
      <Dialog.Title>Update Section</Dialog.Title>
      <Dialog.Description>Kindly answer the field to update a section.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/updateSecEvent" use:enhance>
      <input name="id" type="hidden" value={$formData.id} />
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
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <Loader class="animate-spin" />
            </div>
          {/if}
          Update
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

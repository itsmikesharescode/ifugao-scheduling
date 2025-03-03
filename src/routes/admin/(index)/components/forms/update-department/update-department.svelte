<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { updateDepSchema, type UpdateDepSchema } from '../schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { urlParamReducer } from '$lib/utils';
  import { goto } from '$app/navigation';
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';

  interface Props {
    updateDepForm: SuperValidated<Infer<UpdateDepSchema>>;
  }
</script>

<script lang="ts">
  import { useDepartmentTableState } from '../../table/state.svelte';
  import { page } from '$app/state';

  const { updateDepForm }: Props = $props();

  const form = superForm(updateDepForm, {
    validators: zodClient(updateDepSchema),
    id: crypto.randomUUID(),
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

  const tableState = useDepartmentTableState();

  const open = $derived(page.url.searchParams.get('mode') === 'update');

  $effect(() => {
    if (open) {
      const activeRow = tableState.getActiveRow();

      if (activeRow) {
        $formData.id = activeRow.id;
        $formData.code = activeRow.code;
        $formData.name = activeRow.name;
        $formData.color = activeRow.color;
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
      <Dialog.Title>Update Department</Dialog.Title>
      <Dialog.Description>Kindly answer the field to update department.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/updateDepEvent" use:enhance>
      <input name="id" type="hidden" value={$formData.id} />

      <Form.Field {form} name="code">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Code</Form.Label>
            <Input {...props} bind:value={$formData.code} placeholder="Enter department code" />
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

      <div class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          <FormSpinner isLoading={$submitting} />
          Update
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

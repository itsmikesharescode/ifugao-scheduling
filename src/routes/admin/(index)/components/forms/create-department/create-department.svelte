<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { createDepSchema, type CreateDepSchema } from '../schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { urlParamReducer } from '$lib/utils';
  import { goto } from '$app/navigation';
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';

  interface Props {
    createDepForm: SuperValidated<Infer<CreateDepSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';

  const { createDepForm }: Props = $props();

  const form = superForm(createDepForm, {
    validators: zodClient(createDepSchema),
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
      <Dialog.Title>Create Department</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create department.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createDepEvent" use:enhance>
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

      <div class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          <FormSpinner isLoading={$submitting} />
          Create
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

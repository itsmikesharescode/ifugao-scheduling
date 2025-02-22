<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { createSecSchema, type CreateSecSchema } from '../schema';
  import { urlParamReducer } from '$lib/utils';
  import DepartmentPicker from '$lib/components/select-picker/department-picker.svelte';

  interface Props {
    createSecForm: SuperValidated<Infer<CreateSecSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';

  const { createSecForm }: Props = $props();

  const form = superForm(createSecForm, {
    validators: zodClient(createSecSchema),
    id: crypto.randomUUID(),
    dataType: 'json',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
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
      <Dialog.Title>Create Section</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create a section.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createSecEvent" use:enhance>
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
          Create
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

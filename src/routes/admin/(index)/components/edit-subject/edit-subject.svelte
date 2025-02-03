<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { editSubjectSchema, type EditSubjectSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/state.svelte';

  interface Props {
    editSubjectForm: SuperValidated<Infer<EditSubjectSchema>>;
  }

  const { editSubjectForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(editSubjectForm, {
    validators: zodClient(editSubjectSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.showUpdate = false;
          tableState.setActiveRow(null);
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (tableState.showUpdate) {
      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.course_code = tableState.getActiveRow()?.course_code ?? '';
      $formData.name = tableState.getActiveRow()?.name ?? '';

      return () => {};
    }
  });
</script>

<Dialog.Root
  bind:open={tableState.showUpdate}
  onOpenChange={() => {
    tableState.showUpdate = false;
    form.reset();
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Subject</Dialog.Title>
      <Dialog.Description>Kindly answer the field to edit the subject.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/editSubjectEvent" use:enhance>
      <input name="id" type="hidden" bind:value={$formData.id} />
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

      <div class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <Loader class="animate-spin" />
            </div>
          {/if}
          Edit Subject
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { editInformationSchema, type EditInformationSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/state.svelte';

  interface Props {
    editInformationForm: SuperValidated<Infer<EditInformationSchema>>;
  }

  const { editInformationForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(editInformationForm, {
    validators: zodClient(editInformationSchema),
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
      const activeRow = tableState.getActiveRow();

      $formData.user_id = activeRow?.user_id ?? '';
      $formData.firstname = activeRow?.firstname ?? '';
      $formData.middlename = activeRow?.middlename ?? '';
      $formData.lastname = activeRow?.lastname ?? '';
      $formData.academic_rank = activeRow?.academic_rank ?? '';
      $formData.department = activeRow?.department ?? '';
      $formData.status = activeRow?.status ?? '';
      $formData.gender = activeRow?.gender ?? '';
      $formData.birth_date = activeRow?.birth_date ?? '';
      return () => {
        form.reset();
      };
    }
  });
</script>

<form method="POST" action="?/editSubjectEvent" use:enhance>
  <input name="user_id" type="hidden" bind:value={$formData.user_id} />
  <Form.Field {form} name="firstname">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>First Name</Form.Label>
        <Input {...props} bind:value={$formData.firstname} placeholder="Enter new first name" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="middlename">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Middle Name</Form.Label>
        <Input {...props} bind:value={$formData.middlename} placeholder="Enter new middle name" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="lastname">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Last Name</Form.Label>
        <Input {...props} bind:value={$formData.lastname} placeholder="Enter new last name" />
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
      Update Information
    </Form.Button>
  </div>
</form>

<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { editInformationSchema, type EditInformationSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../../table/state.svelte';
  import CalendarPicker from '$lib/components/calendar-picker/calendar-picker.svelte';
  import SelectPicker from '$lib/components/select-picker/select-picker.svelte';
  import DepartmentPicker, {
    sampleDeps
  } from '$lib/components/select-picker/department-picker.svelte';

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
      $formData.departments = activeRow?.departments ?? [];
      $formData.gender = activeRow?.gender ?? '';
      $formData.birth_date = activeRow?.birth_date ?? '';
      $formData.status = activeRow?.status ?? '';

      return () => {
        form.reset();
      };
    }
  });
</script>

<form method="POST" action="?/editInformationEvent" use:enhance>
  <input name="user_id" type="hidden" bind:value={$formData.user_id} />
  <div class="grid gap-2 md:grid-cols-2 md:gap-4">
    <div class="">
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
            <Input
              {...props}
              bind:value={$formData.middlename}
              placeholder="Enter new middle name"
            />
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

      <Form.Field {form} name="birth_date">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Birth Date</Form.Label>
            <CalendarPicker type="single" bind:dateString={$formData.birth_date} />
            <input name={props.name} type="hidden" bind:value={$formData.birth_date} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>

    <div class="">
      <Form.Field {form} name="gender">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Gender</Form.Label>
            <SelectPicker
              selections={[
                { id: crypto.randomUUID(), name: 'Male', value: 'Male' },
                { id: crypto.randomUUID(), name: 'Female', value: 'Female' }
              ]}
              bind:selected={$formData.gender}
              placeholder="Select new gender"
            />
            <input name={props.name} type="hidden" bind:value={$formData.gender} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="academic_rank">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Academic Rank</Form.Label>
            <Input
              {...props}
              bind:value={$formData.academic_rank}
              placeholder="Enter new academic rank"
            />
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

      <Form.Field {form} name="status">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Status</Form.Label>
            <Input {...props} bind:value={$formData.status} placeholder="Enter new status" />
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
    </div>
  </div>
</form>

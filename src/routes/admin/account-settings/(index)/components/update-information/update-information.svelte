<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updateInfoSchema, type UpdateInfoSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import SelectPicker from '$lib/components/select-picker/select-picker.svelte';
  import { parseDate } from '@internationalized/date';
  import CalendarPicker from '$lib/components/calendar-picker/calendar-picker.svelte';
  interface Props {
    updateInfoForm: SuperValidated<Infer<UpdateInfoSchema>>;
  }

  const { updateInfoForm }: Props = $props();

  const form = superForm(updateInfoForm, {
    validators: zodClient(updateInfoSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
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
</script>

<form method="POST" action="?/updateInfoEvent" use:enhance>
  <Form.Field {form} name="firstname">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>First Name</Form.Label>
        <Input
          {...props}
          bind:value={$formData.firstname}
          placeholder="Enter your new first name"
        />
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
          placeholder="Enter your new middle name"
        />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="lastname">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Last Name</Form.Label>
        <Input {...props} bind:value={$formData.lastname} placeholder="Enter your new last name" />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="gender">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Gender</Form.Label>
        <SelectPicker
          selections={[
            { id: 'Male', name: 'Male', value: 'Male' },
            { id: 'Female', name: 'Female', value: 'Female' }
          ]}
          bind:selected_id={$formData.gender}
          placeholder="Select gender"
        >
          {#snippet childLoop({ props, selected_id })}
            <span>{props.name} </span>
          {/snippet}
        </SelectPicker>
        <input name={props.name} type="hidden" value={$formData.gender} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="birth_date">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Birth Date</Form.Label>
        <CalendarPicker
          type="single"
          title="Select Birth Date"
          bind:value={
            () => {
              if ($formData.birth_date) {
                return parseDate($formData.birth_date);
              }
            },
            (v) => {
              $formData.birth_date = v ? v.toString() : '';
            }
          }
        />
        <input name={props.name} type="hidden" value={$formData.birth_date} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="flex justify-end">
    <Form.Button disabled={$submitting} class="relative">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="animate-spin" />
        </div>
      {/if}
      Update Information
    </Form.Button>
  </div>
</form>

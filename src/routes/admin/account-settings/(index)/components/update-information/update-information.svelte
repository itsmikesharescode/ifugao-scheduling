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
  import { page } from '$app/state';
  import { tick } from 'svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  interface Props {
    updateInfoForm: SuperValidated<Infer<UpdateInfoSchema>>;
  }

  const { updateInfoForm }: Props = $props();
  const user = $derived(page.data.user);
  let editState = $state(false);

  const form = superForm(updateInfoForm, {
    validators: zodClient(updateInfoSchema),
    id: crypto.randomUUID(),
    onUpdate: async ({ result }) => {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success(data.msg);
          editState = false;
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (editState) {
      $formData.firstname = user?.user_metadata.firstname;
      $formData.middlename = user?.user_metadata.middlename;
      $formData.lastname = user?.user_metadata.lastname;
      $formData.gender = user?.user_metadata.gender;
      $formData.birth_date = user?.user_metadata.birth_date;
    }
  });
</script>

{#snippet labelTemplate({ label, value }: { label: string; value: string })}
  <div class="flex flex-col gap-2">
    <Label>{label}</Label>
    <span
      class="md:text-sm' flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {value}
    </span>
  </div>
{/snippet}
{#if !editState}
  <div class="flex flex-col gap-4">
    {@render labelTemplate({ label: 'First Name', value: user?.user_metadata.firstname })}
    {@render labelTemplate({ label: 'Middle Name', value: user?.user_metadata.middlename })}
    {@render labelTemplate({ label: 'Last Name', value: user?.user_metadata.lastname })}
    {@render labelTemplate({ label: 'Gender', value: user?.user_metadata.gender })}
    {@render labelTemplate({ label: 'Birth Date', value: user?.user_metadata.birth_date })}

    <Button onclick={() => (editState = true)} variant="secondary" class="ml-auto w-fit"
      >Edit Information</Button
    >
  </div>
{:else}
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
          <Input
            {...props}
            bind:value={$formData.lastname}
            placeholder="Enter your new last name"
          />
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

    <div class="flex items-center justify-between">
      <Button variant="secondary" onclick={() => (editState = false)}>Back</Button>
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
{/if}

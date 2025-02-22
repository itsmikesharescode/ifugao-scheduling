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
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import CalendarPicker from '$lib/components/calendar-picker/calendar-picker.svelte';
  import SelectPicker from '$lib/components/select-picker/select-picker.svelte';
  import DepartmentPicker from '$lib/components/select-picker/department-picker.svelte';
  interface Props {
    createFacForm: SuperValidated<Infer<CreateFacSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { parseDate } from '@internationalized/date';

  const { createFacForm }: Props = $props();

  const form = superForm(createFacForm, {
    validators: zodClient(createFacSchema),
    id: crypto.randomUUID(),
    dataType: 'json',
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
  <Dialog.Content class="flex max-h-screen max-w-2xl flex-col p-0">
    <Dialog.Header class="px-6 pt-6">
      <Dialog.Title>Create Faculty</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create a faculty.</Dialog.Description>
    </Dialog.Header>
    <ScrollArea class="">
      <form method="POST" action="?/createFacEvent" use:enhance class="max-h-[80dvh] px-6">
        <div class="grid md:grid-cols-2 md:gap-4 lg:grid-cols-2">
          <div class="">
            <Form.Field {form} name="firstname">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>First Name</Form.Label>
                  <Input
                    {...props}
                    bind:value={$formData.firstname}
                    placeholder="Enter first name"
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
                    placeholder="Enter middle name"
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="lastname">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Last Name</Form.Label>
                  <Input {...props} bind:value={$formData.lastname} placeholder="Enter last name" />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="status">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Status</Form.Label>
                  <Input {...props} bind:value={$formData.status} placeholder="Enter status" />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>

          <div class="">
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
                    placeholder="Select gender"
                  />
                  <input name={props.name} type="hidden" value={$formData.gender} />
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
                    placeholder="Enter academic rank"
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
          </div>
        </div>

        <div class="flex justify-end py-6">
          <Form.Button disabled={$submitting} class="relative">
            <FormSpinner isLoading={$submitting} />
            Create
          </Form.Button>
        </div>
      </form>
    </ScrollArea>
  </Dialog.Content>
</Dialog.Root>

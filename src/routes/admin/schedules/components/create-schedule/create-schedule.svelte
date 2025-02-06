<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Trash2 from 'lucide-svelte/icons/trash-2';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { createScheduleSchema, type CreateScheduleSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import SelectPicker from '$lib/components/select-picker/select-picker.svelte';
  import SubjectPicker, { sampleSubs } from '$lib/components/select-picker/subject-picker.svelte';
  import SectionPicker, { sampleSecs } from '$lib/components/select-picker/section-picker.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { tick } from 'svelte';
  import DepartmentPicker, {
    sampleDeps
  } from '$lib/components/select-picker/department-picker.svelte';
  interface Props {
    createScheduleForm: SuperValidated<Infer<CreateScheduleSchema>>;
  }

  const { createScheduleForm }: Props = $props();

  let open = $state(false);

  const form = superForm(createScheduleForm, {
    validators: zodClient(createScheduleSchema),
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

  //TODO: must know how to parse the form names dynamically so server can understand

  let ref = $state<HTMLElement>();

  const increaseDynamicForm = async () => {
    $formData.dynamic_form = [
      ...$formData.dynamic_form,
      {
        code: '',
        section_id: 0,
        subject_id: 0,
        units: 0,
        num_of_hours: { lecture: 0, lab: 0 },
        schedule: {
          batch: '',
          color: ''
        }
      }
    ];

    await tick();
    if (ref) {
      ref.scrollTo({
        top: ref.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleDeleteForm = (index: number) => {
    $formData.dynamic_form = $formData.dynamic_form.filter((_, i) => i !== index);
  };

  const resetForm = () => {
    $formData.dynamic_form = [$formData.dynamic_form[0]];
  };

  $effect(() => {
    if (open) {
      $formData.dynamic_form = [
        {
          code: '',
          section_id: 0,
          subject_id: 0,
          units: 0,
          num_of_hours: { lecture: 0, lab: 0 },
          schedule: {
            batch: '',
            color: ''
          }
        }
      ];

      return () => {};
    }
  });
</script>

<Dialog.Root
  bind:open
  onOpenChange={() => {
    form.reset();
  }}
>
  <Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
    Create Schedule
    <Plus class="ml-auto" />
  </Dialog.Trigger>
  <Dialog.Content class="max-h-screen max-w-7xl p-0">
    <Dialog.Header class="px-6 pt-6">
      <Dialog.Title>Create Schedule</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create a schedule.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createScheduleEvent" use:enhance class="flex flex-col gap-4">
      <div class="grid grid-cols-3 items-center gap-4 px-6">
        <Form.Field {form} name="semester">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Semester</Form.Label>
              <SelectPicker
                selections={[
                  { id: crypto.randomUUID(), name: 'First Semester', value: 'First Semester' },
                  { id: crypto.randomUUID(), name: 'Second Semester', value: 'Second Semester' },
                  { id: crypto.randomUUID(), name: 'Third Semester', value: 'Third Semester' }
                ]}
                bind:selected={$formData.semester}
              />
              <input name={props.name} type="hidden" bind:value={$formData.semester} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="school_year">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>School Year</Form.Label>
              <SelectPicker
                selections={[
                  { id: crypto.randomUUID(), name: 'First Year', value: 'First Year' },
                  { id: crypto.randomUUID(), name: 'Second Year', value: 'Second Year' },
                  { id: crypto.randomUUID(), name: 'Third Year', value: 'Third Year' },
                  { id: crypto.randomUUID(), name: 'Fourth Year', value: 'Fourth Year' }
                ]}
                bind:selected={$formData.school_year}
              />
              <input name={props.name} type="hidden" bind:value={$formData.semester} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="department_id">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Department</Form.Label>
              <DepartmentPicker
                departments={sampleDeps}
                bind:selected_id={$formData.department_id}
              />
              <input name={props.name} type="hidden" bind:value={$formData.department_id} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>

      <div class="max-h-[80dvh] overflow-auto px-6" bind:this={ref}>
        <div class="flex flex-col gap-4">
          {#each $formData.dynamic_form as _, index}
            <div class="rounded-lg border-2 bg-secondary/50 p-4">
              <div class="flex items-center justify-between p-2">
                <span class="text-base font-semibold">Form # {index + 1}</span>
                {#if $formData.dynamic_form.length > 1}
                  <Button size="sm" variant="destructive" onclick={() => handleDeleteForm(index)}>
                    Delete
                    <Trash2 class="size-4" />
                  </Button>
                {/if}
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="">
                  <Form.Field {form} name={`dynamic_form[${index}].subject_id`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Subject</Form.Label>
                        <SubjectPicker
                          subjects={sampleSubs}
                          bind:selected_id={$formData.dynamic_form[index].subject_id}
                        />
                        <input
                          name={props.name}
                          type="hidden"
                          bind:value={$formData.dynamic_form[index].subject_id}
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <Form.Field {form} name={`dynamic_form[${index}].section_id`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Section</Form.Label>
                        <SectionPicker
                          sections={sampleSecs}
                          bind:selected_id={$formData.dynamic_form[index].section_id}
                        />
                        <input
                          name={props.name}
                          type="hidden"
                          bind:value={$formData.dynamic_form[index].section_id}
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <Form.Field {form} name={`dynamic_form[${index}].code`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Code</Form.Label>
                        <Input
                          {...props}
                          bind:value={$formData.dynamic_form[index].code}
                          placeholder="Enter code"
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <Form.Field {form} name={`dynamic_form[${index}].units`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Units</Form.Label>
                        <Input
                          type="number"
                          {...props}
                          bind:value={$formData.dynamic_form[index].units}
                          placeholder="Enter units"
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>
                </div>

                <div class="">
                  <Form.Field {form} name={`dynamic_form[${index}].num_of_hours.lecture`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Lecture Hours</Form.Label>
                        <Input
                          type="number"
                          {...props}
                          bind:value={$formData.dynamic_form[index].num_of_hours.lecture}
                          placeholder="Enter lecture hours"
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <Form.Field {form} name={`dynamic_form[${index}].num_of_hours.lab`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Laboratory Hours</Form.Label>
                        <Input
                          type="number"
                          {...props}
                          bind:value={$formData.dynamic_form[index].num_of_hours.lab}
                          placeholder="Enter laboratory hours"
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <Form.Field {form} name={`dynamic_form[${index}].schedule.batch`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Batch</Form.Label>
                        <SelectPicker
                          placeholder="Select batch"
                          selections={[
                            { id: crypto.randomUUID(), name: 'First Batch', value: 'First Batch' },
                            { id: crypto.randomUUID(), name: 'Second Batch', value: 'Second Batch' }
                          ]}
                          bind:selected={$formData.dynamic_form[index].schedule.batch}
                        />
                        <input
                          name={props.name}
                          type="hidden"
                          bind:value={$formData.dynamic_form[index].schedule.batch}
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>

                  <Form.Field {form} name={`dynamic_form[${index}].schedule.color`}>
                    <Form.Control>
                      {#snippet children({ props })}
                        <Form.Label>Batch Color</Form.Label>
                        <Input
                          type="color"
                          {...props}
                          bind:value={$formData.dynamic_form[index].schedule.color}
                          placeholder="Enter batch color"
                        />
                      {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.Field>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="flex justify-end gap-4 px-6 pb-6">
        {#if $formData.dynamic_form.length > 2}
          <Button variant="secondary" onclick={resetForm}>
            Reset {$formData.dynamic_form.length} Forms
          </Button>
        {/if}
        <Button onclick={increaseDynamicForm}>Increase Form</Button>
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

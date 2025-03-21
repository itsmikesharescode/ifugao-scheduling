<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Trash2 from 'lucide-svelte/icons/trash-2';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { updateSchedSchema, type UpdateSchedSchema } from '../schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import SelectPicker from '$lib/components/select-picker/select-picker.svelte';
  import SubjectPicker, { sampleSubs } from '$lib/components/select-picker/subject-picker.svelte';
  import SectionPicker, { sampleSecs } from '$lib/components/select-picker/section-picker.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { tick } from 'svelte';
  import * as Resizable from '$lib/components/ui/resizable/index.js';
  import DepartmentPicker from '$lib/components/select-picker/department-picker.svelte';
  import { urlParamReducer } from '$lib/utils';
  import { goto } from '$app/navigation';
  import TimePicker, {
    convertSelectedTime,
    timestampToSelectedTime
  } from '$lib/components/select-picker/time-picker.svelte';
  import WeeksPicker from '$lib/components/select-picker/weeks-picker.svelte';
  import FacultyPicker from '$lib/components/select-picker/faculty-picker.svelte';
  import { getSections, getSubjects, getTime } from '../create-schedule/create-schedule.svelte';
</script>

<script lang="ts">
  import { useSchedTableState } from '../../table/state.svelte';
  import { page } from '$app/state';

  interface Props {
    updateSchedForm: SuperValidated<Infer<UpdateSchedSchema>>;
  }

  const { updateSchedForm }: Props = $props();

  const tableState = useSchedTableState();

  let startTime = $state(getTime());
  let endTime = $state(getTime());
  let subjects = $state<Awaited<ReturnType<typeof getSubjects>>>(null);
  let sections = $state<Awaited<ReturnType<typeof getSections>>>(null);

  const form = superForm(updateSchedForm, {
    validators: zodClient(updateSchedSchema),
    id: crypto.randomUUID(),
    dataType: 'json',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          startTime = getTime();
          endTime = getTime();
          await goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  let ref = $state<HTMLElement>();

  const increaseDynamicForm = async () => {
    $formData.dynamic_form = [
      ...$formData.dynamic_form,
      {
        code: '',
        section_id: '',
        subject_id: '',
        units: 0,
        num_of_hours: { lecture: 0, lab: 0 }
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
    $formData.dynamic_form = $formData.dynamic_form.filter((_: unknown, i: number) => i !== index);
  };

  const resetForm = () => {
    $formData.dynamic_form = [$formData.dynamic_form[0]];
  };

  $effect(() => {
    if (open) {
      const activeRow = tableState.getActiveRow();

      if (activeRow) {
        getSubjects().then((v) => {
          subjects = v;
        });

        getSections().then((v) => {
          sections = v;
        });

        startTime = timestampToSelectedTime(activeRow.start_time);
        endTime = timestampToSelectedTime(activeRow.end_time);

        $formData.schedule.start_time = activeRow.start_time;
        $formData.schedule.end_time = activeRow.end_time;

        $formData.id = activeRow.id;
        $formData.faculty_id = activeRow.faculty_id;
        $formData.department_id = activeRow.department_id;
        $formData.semester = activeRow.semester;
        $formData.school_year = activeRow.school_year;
        $formData.schedule.days = activeRow.days;
        $formData.dynamic_form = activeRow.dynamic_form;
      } else {
        goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
      }

      return () => {};
    }
  });

  const open = $derived(page.url.searchParams.get('mode') === 'update');
</script>

<Dialog.Root
  {open}
  onOpenChange={() => {
    form.reset();
    startTime = getTime();
    endTime = getTime();
    tableState.setActiveRow(null);
    goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
  }}
>
  <Dialog.Content class="max-h-screen max-w-7xl overflow-hidden p-0" preventScroll>
    <Dialog.Header class="px-6 pt-6">
      <Dialog.Title>Update Schedule</Dialog.Title>
      <Dialog.Description>'Kindly answer the field to update a schedule.'</Dialog.Description>
    </Dialog.Header>

    <form
      method="POST"
      action="?/updateSchedEvent"
      use:enhance
      class="relative flex flex-col gap-4"
    >
      <input type="hidden" name="id" bind:value={$formData.id} />
      <Resizable.PaneGroup direction="vertical" class="min-h-[80dvh]">
        <Resizable.Pane maxSize={70}>
          <div class="px-6">
            <Form.Field {form} name="faculty_id">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Faculty</Form.Label>

                  <FacultyPicker
                    class="w-[320px] md:w-[550px] lg:w-[850px]"
                    bind:selected={
                      () => {
                        return {
                          single: $formData.faculty_id ?? undefined,
                          multiple: undefined
                        };
                      },
                      (v) => {
                        $formData.faculty_id = v.single ?? null;
                      }
                    }
                  />
                  <input name={props.name} type="hidden" bind:value={$formData.faculty_id} />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="grid grid-cols-3 items-center gap-4 px-6">
            <Form.Field {form} name="semester">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Semester</Form.Label>
                  <SelectPicker
                    selections={[
                      { id: 'First Semester', name: 'First Semester', value: 'First Semester' },
                      {
                        id: 'Second Semester',
                        name: 'Second Semester',
                        value: 'Second Semester'
                      },
                      { id: 'Third Semester', name: 'Third Semester', value: 'Third Semester' }
                    ]}
                    bind:selected_id={$formData.semester}
                  >
                    {#snippet childLoop({ props, selected_id })}
                      <span>{props.name}</span>
                    {/snippet}
                  </SelectPicker>
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
                      { id: 'First Year', name: 'First Year', value: 'First Year' },
                      { id: 'Second Year', name: 'Second Year', value: 'Second Year' },
                      { id: 'Third Year', name: 'Third Year', value: 'Third Year' },
                      { id: 'Fourth Year', name: 'Fourth Year', value: 'Fourth Year' }
                    ]}
                    bind:selected_id={$formData.school_year}
                  >
                    {#snippet childLoop({ props, selected_id })}
                      <span>{props.name}</span>
                    {/snippet}
                  </SelectPicker>
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
                    departments={page.data.departments ?? []}
                    bind:selected={
                      () => {
                        return {
                          single: $formData.department_id ?? undefined,
                          multiple: undefined
                        };
                      },
                      (v) => {
                        $formData.department_id = v.single ?? null;
                      }
                    }
                  />
                  <input name={props.name} type="hidden" bind:value={$formData.department_id} />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>

          <div class="grid grid-cols-3 items-center gap-4 px-6">
            <Form.Field {form} name="schedule.start_time">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Start Time</Form.Label>
                  <TimePicker
                    bind:time={
                      () => {
                        return startTime;
                      },
                      (v) => {
                        $formData.schedule.start_time = convertSelectedTime(
                          v.hour,
                          v.minute,
                          v.second,
                          v.ampm
                        );
                      }
                    }
                  />
                  <input
                    name={props.name}
                    type="hidden"
                    bind:value={$formData.schedule.start_time}
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="schedule.end_time">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>End Time</Form.Label>
                  <TimePicker
                    bind:time={
                      () => {
                        return endTime;
                      },
                      (v) => {
                        $formData.schedule.end_time = convertSelectedTime(
                          v.hour,
                          v.minute,
                          v.second,
                          v.ampm
                        );
                      }
                    }
                  />
                  <input name={props.name} type="hidden" bind:value={$formData.schedule.end_time} />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="schedule.days">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Days</Form.Label>
                  <WeeksPicker bind:selectedDays={$formData.schedule.days} />
                  <input name={props.name} type="hidden" bind:value={$formData.schedule.days} />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
        </Resizable.Pane>
        <Resizable.Handle withHandle />
        <Resizable.Pane class="flex flex-col" minSize={15}>
          <div class="mt-6 flex items-center justify-between gap-4 px-6">
            <div class="">
              <Dialog.Title>Assigned Subjects</Dialog.Title>
            </div>

            <div class="">
              {#if $formData.dynamic_form.length > 2}
                <Button variant="secondary" onclick={resetForm}>
                  Reset {$formData.dynamic_form.length} Forms
                </Button>
              {/if}
              <Button onclick={increaseDynamicForm}>Increase Form</Button>

              <Form.Button disabled={$submitting} class="relative">
                {#if $submitting}
                  <div
                    class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary"
                  >
                    <Loader class="animate-spin" />
                  </div>
                {/if}
                Update
              </Form.Button>
            </div>
          </div>
          <div class="overflow-auto p-6" bind:this={ref}>
            <div class="mb-10 flex flex-col gap-4">
              {#each $formData.dynamic_form as _, index (index)}
                <div class="rounded-lg border-2 bg-secondary/50 p-4">
                  <div class="flex items-center justify-between p-2">
                    <span class="text-base font-semibold">Form # {index + 1}</span>
                    {#if $formData.dynamic_form.length > 1}
                      <Button
                        size="sm"
                        variant="destructive"
                        onclick={() => handleDeleteForm(index)}
                      >
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
                            <SelectPicker
                              selections={subjects?.map((v) => ({
                                id: v.id.toString(),
                                name: v.name,
                                value: v.name
                              })) ?? []}
                              bind:selected_id={$formData.dynamic_form[index].subject_id}
                            >
                              {#snippet childLoop({ props, selected_id })}
                                <span>{props.name}</span>
                              {/snippet}
                            </SelectPicker>
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
                            <SelectPicker
                              selections={sections?.map((v) => ({
                                id: v.id.toString(),
                                name: v.name,
                                value: v.name
                              })) ?? []}
                              bind:selected_id={$formData.dynamic_form[index].section_id}
                            >
                              {#snippet childLoop({ props, selected_id })}
                                <span>{props.name}</span>
                              {/snippet}
                            </SelectPicker>
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
                    </div>

                    <div class="">
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
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </Resizable.Pane>
      </Resizable.PaneGroup>
    </form>
  </Dialog.Content>
</Dialog.Root>

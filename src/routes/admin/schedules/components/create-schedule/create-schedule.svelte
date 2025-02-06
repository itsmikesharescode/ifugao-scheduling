<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { createScheduleSchema, type CreateScheduleSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';

  interface Props {
    createScheduleForm: SuperValidated<Infer<CreateScheduleSchema>>;
  }

  const { createScheduleForm }: Props = $props();

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

  //TODO: implement dynamic forms based in current wip

  const increaseDynamicForm = () => {
    $formData.dynamic_form = [
      ...$formData.dynamic_form,
      {
        code: '',
        section_id: 0,
        subject_id: 0,
        units: 0,
        num_of_hours: { lecture: 0, lab: 0 },
        schedule: ''
      }
    ];
  };
</script>

<Dialog.Root
  onOpenChange={() => {
    form.reset();
  }}
>
  <Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
    Create Schedule
    <Plus class="ml-auto" />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Schedule</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create a schedule.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createDepartmentEvent" use:enhance>
      {#each $formData.dynamic_form as _, index (index)}
        <Form.Field {form} name={`dynamic_form[${index}].code`}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Department Code</Form.Label>
              <Input
                {...props}
                bind:value={$formData.dynamic_form[index].code}
                placeholder="Enter department code"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name={`dynamic_form[${index}].units`}>
          <Form.Control>
            <Input
              type="number"
              bind:value={$formData.dynamic_form[index].units}
              placeholder="Enter units"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      {/each}

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

    <button onclick={increaseDynamicForm}>Increase</button>
  </Dialog.Content>
</Dialog.Root>

<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { createDepartmentSchema, type CreateDepartmentSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';

  interface Props {
    createDepartmentForm: SuperValidated<Infer<CreateDepartmentSchema>>;
  }

  const { createDepartmentForm }: Props = $props();

  const form = superForm(createDepartmentForm, {
    validators: zodClient(createDepartmentSchema),
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

<Dialog.Root
  onOpenChange={() => {
    form.reset();
  }}
>
  <Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
    Create Department
    <Plus class="ml-auto" />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Department</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create department.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createDepartmentEvent" use:enhance>
      <Form.Field {form} name="department_code">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Code</Form.Label>
            <Input
              {...props}
              bind:value={$formData.department_code}
              placeholder="Enter department code"
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Name</Form.Label>
            <Input {...props} bind:value={$formData.name} placeholder="Enter department name" />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="color">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Color</Form.Label>
            <Input
              type="color"
              {...props}
              bind:value={$formData.color}
              placeholder="Enter department name"
            />
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

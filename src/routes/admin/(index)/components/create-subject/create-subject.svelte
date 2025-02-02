<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { createSubjectSchema, type CreateSubjectSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';

  interface Props {
    createSubjectForm: SuperValidated<Infer<CreateSubjectSchema>>;
  }

  const { createSubjectForm }: Props = $props();

  const form = superForm(createSubjectForm, {
    validators: zodClient(createSubjectSchema),
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
    Create Subject
    <Plus class="ml-auto" />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Subject</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create subject.</Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createSubjectEvent" use:enhance>
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
          Create
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>

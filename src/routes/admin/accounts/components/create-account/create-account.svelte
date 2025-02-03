<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Loader from 'lucide-svelte/icons/loader';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { createAccountSchema, type CreateAccountSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

  interface Props {
    createAccountForm: SuperValidated<Infer<CreateAccountSchema>>;
  }

  const { createAccountForm }: Props = $props();

  const form = superForm(createAccountForm, {
    validators: zodClient(createAccountSchema),
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
    Create Account
    <Plus class="ml-auto" />
  </Dialog.Trigger>
  <Dialog.Content class="flex max-h-screen max-w-7xl flex-col p-0">
    <Dialog.Header class="px-6 pt-6">
      <Dialog.Title>Create Account</Dialog.Title>
      <Dialog.Description>Kindly answer the field to create an account.</Dialog.Description>
    </Dialog.Header>
    <ScrollArea class="">
      <form method="POST" action="?/createAccountEvent" use:enhance class="max-h-[80dvh] px-6">
        <div class="grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          <div class="">
            <Form.Field {form} name="email">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Email</Form.Label>
                  <Input {...props} bind:value={$formData.email} placeholder="Enter email" />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

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
          </div>

          <div class="">
            <Form.Field {form} name="birth_date">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Birth Date</Form.Label>
                  <Input
                    {...props}
                    bind:value={$formData.birth_date}
                    placeholder="Enter birth date"
                  />
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

            <Form.Field {form} name="department">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Department</Form.Label>
                  <Input
                    {...props}
                    bind:value={$formData.department}
                    placeholder="Enter department"
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="gender">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Gender</Form.Label>
                  <Input {...props} bind:value={$formData.gender} placeholder="Enter gender" />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>

          <div class="">
            <Form.Field {form} name="status">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Status</Form.Label>
                  <Input {...props} bind:value={$formData.status} placeholder="Enter status" />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="password">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Password</Form.Label>
                  <Input
                    type="password"
                    {...props}
                    bind:value={$formData.password}
                    placeholder="Enter password"
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="confirmPassword">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Confirm Password</Form.Label>
                  <Input
                    type="password"
                    {...props}
                    bind:value={$formData.confirmPassword}
                    placeholder="Confirm password"
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
        </div>

        <div class="flex justify-end py-6">
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
    </ScrollArea>
  </Dialog.Content>
</Dialog.Root>

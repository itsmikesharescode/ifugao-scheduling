<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { registerSchema, type RegisterSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Button from '$lib/components/ui/button/button.svelte';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  interface Props {
    registerForm: SuperValidated<Infer<RegisterSchema>>;
  }

  const { registerForm }: Props = $props();

  const form = superForm(registerForm, {
    validators: zodClient(registerSchema),
    id: crypto.randomUUID(),
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
</script>

<section class="flex flex-col items-center justify-center">
  <span class="text-2xl font-bold">Register</span>
  <span class="text-sm text-muted-foreground">Fill the field to register your account</span>
</section>

<section class="w-80">
  <form method="POST" action="?/registerEvent" use:enhance class="flex flex-col gap-2">
    <Form.Field {form} name="firstname">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>First Name</Form.Label>
          <Input {...props} bind:value={$formData.firstname} placeholder="Enter your first name" />
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
            placeholder="Enter your middle name"
          />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="lastname">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Last Name</Form.Label>
          <Input {...props} bind:value={$formData.lastname} placeholder="Enter your last name" />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
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
            placeholder="Enter your password"
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
            placeholder="Confirm your password"
          />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>
    <Form.Button disabled={$submitting} class="relative w-full">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="animate-spin" />
        </div>
      {/if}
      Register
    </Form.Button>
  </form>
</section>

<section class="flex flex-col items-center justify-center">
  <span class="text-sm text-muted-foreground">Already have an account?</span>
  <Button href="/" variant="link" class="text-sm">Log in here</Button>
</section>

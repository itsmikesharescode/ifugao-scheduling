<script module lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { forgotPasswordSchema, type ForgotPasswordSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Button from '$lib/components/ui/button/button.svelte';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
</script>

<script lang="ts">
  interface Props {
    forgotPasswordForm: SuperValidated<Infer<ForgotPasswordSchema>>;
  }

  const { forgotPasswordForm }: Props = $props();

  const form = superForm(forgotPasswordForm, {
    validators: zodClient(forgotPasswordSchema),
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

<section class="flex w-80 flex-col items-center justify-center">
  <span class="text-2xl font-bold">Forgot Password</span>
  <span class="text-center text-sm text-muted-foreground"
    >An email containing a password reset link will be sent to your email.</span
  >
</section>

<section class="w-80">
  <form method="POST" action="?/forgotPasswordEvent" use:enhance class="flex flex-col gap-2">
    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
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
      Send Password Reset
    </Form.Button>
  </form>
</section>

<section class="flex flex-col items-center justify-center">
  <span class="text-sm text-muted-foreground">Already recovered your account?</span>
  <Button href="/" variant="link" class="text-sm">Log in here</Button>
</section>

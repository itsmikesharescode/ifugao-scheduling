<script module lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { loginSchema, type LoginSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Button from '$lib/components/ui/button/button.svelte';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
</script>

<script lang="ts">
  interface Props {
    loginForm: SuperValidated<Infer<LoginSchema>>;
  }

  const { loginForm }: Props = $props();

  const form = superForm(loginForm, {
    validators: zodClient(loginSchema),
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
  <span class="text-2xl font-bold">Log in</span>
  <span class="text-sm text-muted-foreground">Log in to your account</span>
</section>

<section class="w-80">
  <form method="POST" action="?/loginEvent" use:enhance class="flex flex-col gap-2">
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
    <Form.Button disabled={$submitting} class="relative w-full">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="animate-spin" />
        </div>
      {/if}
      Log in
    </Form.Button>
  </form>
</section>

<!-- <section class="flex flex-col items-center justify-center">
  <span class="text-sm text-muted-foreground">Don't have an account?</span>
  <Button href="?link=register" variant="link" class="text-sm">Register here</Button>
</section>

<section class="flex flex-col items-center justify-center">
  <Button href="?link=forgot-password" variant="link" class="text-sm">Forgot Password?</Button>
</section> -->

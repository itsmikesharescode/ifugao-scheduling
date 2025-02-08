<script lang="ts">
  import { page } from '$app/state';
  import Register from './components/register/register.svelte';
  import ForgotPassword from './components/forgot-password/forgot-password.svelte';
  import Login from './components/login/login.svelte';

  const { data } = $props();

  const urlParams = $derived(page.url.searchParams.get('link'));
</script>

<main class="flex min-h-screen flex-col items-center justify-center gap-5 p-20">
  <img src="./favicon.png" alt="" class="size-32 rounded-lg object-cover" />
  {#if urlParams === 'register'}
    <Register registerForm={data.registerForm} />
  {:else if urlParams === 'forgot-password'}
    <ForgotPassword forgotPasswordForm={data.forgotPasswordForm} />
  {:else}
    <Login loginForm={data.loginForm} />
  {/if}
</main>

<script lang="ts">
  import { page } from '$app/state';
  const { children } = $props();

  const links = [
    {
      name: 'Informations',
      href: '/admin/account-settings'
    },
    {
      name: 'Profile Picture',
      href: '/admin/account-settings/update-profile'
    },
    {
      name: 'Update Email',
      href: '/admin/account-settings/update-email'
    },
    {
      name: 'Update Password',
      href: '/admin/account-settings/update-password'
    }
  ];
</script>

<main class="grid gap-4 md:grid-cols-[auto,1fr]">
  <nav class="flex max-h-fit flex-col gap-2 border-l-2 p-4">
    {#each links as link}
      <a
        href={link.href}
        class="max-w-fit rounded-lg px-4 py-1 font-sans text-sm transition-all hover:bg-secondary hover:text-primary
        {page.url.pathname === link.href ? 'bg-secondary text-primary' : 'text-muted-foreground'}"
        >{link.name}</a
      >
    {/each}
  </nav>

  <div class="">
    {@render children()}
  </div>
</main>

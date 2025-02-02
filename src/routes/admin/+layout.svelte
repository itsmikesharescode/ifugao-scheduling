<script lang="ts">
  import AdminSidebar from '$lib/components/sidebars/admin-sidebar.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { page } from '$app/state';
  import Darkmode from '$lib/components/sidebars/darkmode.svelte';

  const { children } = $props();

  const detectPage = $derived.by(() => {
    if (page.url.pathname === '/admin') return 'Subjects';

    const [_, segment] = page.url.pathname.split('/admin/');
    const formatted = segment?.split('-').join(' ');

    return formatted ? formatted[0].toUpperCase() + formatted.slice(1) : 'Account Settings';
  });
</script>

<Sidebar.Provider>
  <AdminSidebar />
  <Sidebar.Inset>
    <header class="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <Sidebar.Trigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />

      <div class="flex w-full items-center justify-between">
        <span class="text-sm font-medium">{detectPage}</span>

        <Darkmode />
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>

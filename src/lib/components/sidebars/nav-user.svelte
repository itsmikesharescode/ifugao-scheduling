<script lang="ts" module>
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import Settings from 'lucide-svelte/icons/settings';
  import LogOut from 'lucide-svelte/icons/log-out';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
</script>

<script lang="ts">
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import { toast } from 'svelte-sonner';
  import Button from '../ui/button/button.svelte';
  import FormSpinner from '../spinners/form-spinner.svelte';

  const user = $derived(page.data.user);

  const sidebar = useSidebar();

  let showLogout = $state(false);
  let loader = $state(false);

  const handleLogout = async () => {
    if (!page.data.supabase) return toast.error('Something went wrong');

    loader = true;

    const { error } = await page.data.supabase.auth.signOut();

    if (error) return toast.error(error.message);

    toast.success('Logged out successfully');
    await invalidateAll();

    loader = false;
  };
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            {...props}
          >
            <Avatar.Root class="h-8 w-8 rounded-lg">
              <Avatar.Image
                src={user?.user_metadata?.avatar ?? ''}
                alt={user?.user_metadata?.firstname ?? ''}
              />
              <Avatar.Fallback class="rounded-lg">
                {user?.user_metadata?.firstname?.charAt(0) ?? ''}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{user?.user_metadata?.firstname ?? ''}</span>
              <span class="truncate text-xs">{user?.email ?? ''}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar.Root class="h-8 w-8 rounded-lg">
              <Avatar.Image
                src={user?.user_metadata?.avatar ?? ''}
                alt={user?.user_metadata?.firstname ?? ''}
              />
              <Avatar.Fallback class="rounded-lg">
                {user?.user_metadata?.firstname?.charAt(0) ?? ''}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{user?.user_metadata?.firstname ?? ''}</span>
              <span class="truncate text-xs">{user?.email ?? ''}</span>
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group></DropdownMenu.Group>
        {#if page.data.role !== 'super'}
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item
              onclick={() => {
                sidebar.openMobile = false;
                goto('/admin/account-settings');
              }}
            >
              <Settings />
              Account Settings
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
        {/if}
        <DropdownMenu.Item onclick={() => (showLogout = true)}>
          <LogOut />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>

<AlertDialog.Root bind:open={showLogout}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>You are about to log out of your account.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <Button onclick={handleLogout} disabled={loader} class="relative">
        <FormSpinner isLoading={loader} />
        Continue
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

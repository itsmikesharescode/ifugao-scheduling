<script lang="ts" module>
  // sample data

  export const adminRoutes = [
    {
      title: 'Entries',
      url: '#',
      items: [
        {
          title: 'Subjects',
          url: '/admin'
        },
        {
          title: 'Sections',
          url: '/admin/sections'
        },
        {
          title: 'Departments',
          url: '/admin/departments'
        }
      ]
    },
    {
      title: 'Management',
      url: '#',
      items: [
        {
          title: 'Schedules',
          url: '/admin/schedules'
        },
        {
          title: 'Accounts',
          url: '/admin/accounts'
        }
      ]
    }
  ];
</script>

<script lang="ts">
  import * as Collapsible from '$lib/components/ui/collapsible';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import type { ComponentProps } from 'svelte';
  import NavUser from './nav-user.svelte';
  import { page } from '$app/state';

  let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {...restProps}>
  <Sidebar.Header>
    <div class="grid grid-cols-[auto,1fr] items-center gap-2">
      <enhanced:img src="./assets/logo.png" alt="" class="size-10 object-cover" />
      <div class="flex flex-col">
        <span class="text-base font-medium">Administrator</span>
        <span class="text-sm text-muted-foreground">Management</span>
      </div>
    </div>
    <!-- <SearchForm /> -->
  </Sidebar.Header>
  <Sidebar.Content class="gap-0">
    <!-- We create a Sidebar.Group for each parent. -->
    {#each adminRoutes as group (group.title)}
      <Collapsible.Root title={group.title} open={true} class="group/collapsible">
        <Sidebar.Group>
          <Sidebar.GroupLabel
            class="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {#snippet child({ props })}
              <Collapsible.Trigger {...props}>
                {group.title}
                <ChevronRight
                  class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                />
              </Collapsible.Trigger>
            {/snippet}
          </Sidebar.GroupLabel>
          <Collapsible.Content>
            <Sidebar.GroupContent>
              <Sidebar.Menu class="ml-2 border-l-2 px-2">
                {#each group.items as item (item.title)}
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton isActive={page.url.pathname === item.url}>
                      {#snippet child({ props })}
                        <a title="navigate to {item.url}" href={item.url} {...props}>{item.title}</a
                        >
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                {/each}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Collapsible.Content>
        </Sidebar.Group>
      </Collapsible.Root>
    {/each}
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser
      user={{
        name: 'Joey Baguidudol',
        email: 'admin_joey@gmail.com',
        avatar: '/avatars/shadcn.jpg'
      }}
    />
  </Sidebar.Footer>

  <Sidebar.Rail />
</Sidebar.Root>

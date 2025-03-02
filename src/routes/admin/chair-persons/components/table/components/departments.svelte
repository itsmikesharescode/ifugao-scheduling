<script lang="ts" module>
  import type { Row } from '@tanstack/table-core';
  import { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import type { AccountsPageSchema } from '../schema';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import SearchCode from 'lucide-svelte/icons/search-code';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { page } from '$app/state';

  type TData = unknown;

  export const getDepartmentById = async (department_id: number) => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('deparments_tb')
      .select('code, name')
      .eq('id', department_id)
      .single();

    if (error) return null;

    return data;
  };
</script>

<script lang="ts" generics="TData">
  let { row }: { row: Row<AccountsPageSchema> } = $props();

  let open = $state(false);
  let timeout: NodeJS.Timeout;

  const onMouseEnter = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      open = true;
    }, 500);
  };

  const onMouseLeave = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      open = false;
    }, 500);
  };
</script>

{#if row.original.departments.length > 1}
  <Popover.Root bind:open>
    <Popover.Trigger
      onmouseenter={onMouseEnter}
      onmouseleave={onMouseLeave}
      class={buttonVariants({ variant: 'outline', size: 'sm' })}
    >
      View Departments
      <SearchCode class="size-4" />
    </Popover.Trigger>
    <Popover.Content onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
      {#each row.original.departments as department_id}
        {#await getDepartmentById(department_id)}
          <Skeleton class="h-[20px] w-full rounded-lg" />
        {:then department}
          <div class="flex flex-col">
            <span class="text-sm font-medium">{department?.code}</span>
            <span class="text-xs text-muted-foreground">{department?.name}</span>
          </div>
        {/await}
      {/each}
    </Popover.Content>
  </Popover.Root>
{:else}
  {#await getDepartmentById(row.original.departments[0])}
    <Skeleton class="h-[20px] w-full rounded-lg" />
  {:then department}
    <div class="flex flex-col">
      <span class="text-sm font-medium">{department?.code}</span>
      <span class="text-xs text-muted-foreground">{department?.name}</span>
    </div>
  {/await}
{/if}

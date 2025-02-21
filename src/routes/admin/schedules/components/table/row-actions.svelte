<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import FilePenLine from 'lucide-svelte/icons/file-pen-line';
  import Maximize2 from 'lucide-svelte/icons/maximize-2';
  import FileX2 from 'lucide-svelte/icons/file-x-2';
  import type { Row } from '@tanstack/table-core';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useTableState } from './state.svelte';
  import type { SchedulePageSchema } from './schema';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { urlParamStacker } from '$lib/utils';

  let { row }: { row: Row<SchedulePageSchema> } = $props();

  const tableState = useTableState();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
        <Ellipsis />
        <span class="sr-only">Open Menu</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-[160px]" align="end">
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        tableState.showView = true;
      }}
    >
      View Form
      <Maximize2 class="ml-auto" />
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        goto(urlParamStacker('mode', 'update', page));
      }}
    >
      Edit
      <FilePenLine class="ml-auto" />
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        goto(urlParamStacker('mode', 'delete', page));
      }}
    >
      <span class="text-destructive">Delete</span>
      <FileX2 class="ml-auto text-destructive" />
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

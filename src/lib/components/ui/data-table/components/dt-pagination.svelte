<script lang="ts" module>
  import { page } from '$app/state';
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronsRight from 'lucide-svelte/icons/chevrons-right';
  import ChevronsLeft from 'lucide-svelte/icons/chevrons-left';
  import FileX from 'lucide-svelte/icons/file-x';
  import type { Table } from '@tanstack/table-core';
  import * as Select from '$lib/components/ui/select/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import ConfirmDelete from './confirm-delete.svelte';

  interface Props {
    table: Table<TData>;
    onclick: () => void;
    deleteAllLoader?: boolean;
  }

  let { table, onclick, deleteAllLoader }: Props = $props();

  let open = $state(false);
</script>

<div class="sticky bottom-2 flex flex-wrap items-center justify-between gap-2 px-2">
  <div class="flex-1 text-sm text-muted-foreground">
    <div class="max-w-fit bg-background">
      <span>
        {table.getFilteredSelectedRowModel().rows.length} of
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </span>

      {#if table.getFilteredSelectedRowModel().rows.length > 1}
        <Button variant="destructive" size="sm" onclick={() => (open = true)}>
          Delete All Selected
          <FileX class="ml-auto" />
        </Button>
      {/if}
    </div>
  </div>
  <div class="flex items-start bg-background">
    <div class="flex flex-wrap items-center space-x-2">
      <p class="text-sm font-medium">Rows per page</p>
      <Select.Root
        allowDeselect={false}
        type="single"
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <Select.Trigger class="h-8 w-[70px]">
          {String(table.getState().pagination.pageSize)}
        </Select.Trigger>
        <Select.Content side="top">
          {#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
            <Select.Item value={`${pageSize}`}>
              {pageSize}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    <div class="flex items-center">
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of
        {table.getPageCount()}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          onclick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          class="size-8 p-0"
          onclick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          class="size-8 p-0"
          onclick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          onclick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  </div>
</div>

<ConfirmDelete bind:open {onclick} {deleteAllLoader} />

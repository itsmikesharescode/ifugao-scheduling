<script lang="ts" module>
  type TData = unknown;
  type TValue = unknown;
</script>

<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel
  } from '@tanstack/table-core';
  import { DTPagination } from './components/index';
  import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
  import FlexRender from '$lib/components/ui/data-table/flex-render.svelte';
  import * as Table from '$lib/components/ui/table/index.js';
  import DtViewOptions from './components/dt-view-options.svelte';

  interface Props {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    ondblclick?: (row: TData) => void;
  }

  let { columns, data, ondblclick }: Props = $props();

  let columnVisibility = $state<VisibilityState>({});
  let columnFilters = $state<ColumnFiltersState>([]);
  let sorting = $state<SortingState>([]);
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let rowSelection = $state<RowSelectionState>({});

  const table = createSvelteTable({
    get data() {
      return data;
    },
    state: {
      get sorting() {
        return sorting;
      },
      get columnVisibility() {
        return columnVisibility;
      },
      get rowSelection() {
        return rowSelection ?? {};
      },
      get columnFilters() {
        return columnFilters;
      },
      get pagination() {
        return pagination;
      }
    },
    columns,
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    onColumnVisibilityChange: (updater) => {
      if (typeof updater === 'function') {
        columnVisibility = updater(columnVisibility);
      } else {
        columnVisibility = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });
</script>

<div class="space-y-4">
  <div class="flex">
    <DtViewOptions {table} />
  </div>
  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head colspan={header.colSpan}>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row
            data-state={row.getIsSelected() && 'selected'}
            ondblclick={() => {
              ondblclick?.(row.original);
            }}
          >
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <DTPagination {table} />
</div>

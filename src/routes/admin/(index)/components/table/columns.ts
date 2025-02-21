import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { DepartmentPageSchema } from './schema';
import { DTCheckbox, DTColumnHeader } from '$lib/components/ui/data-table/components/index.js';
import RowActions from './row-actions.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<DepartmentPageSchema>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      renderComponent(DTCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
        class: 'translate-y-[2px]'
      }),
    cell: ({ row }) =>
      renderComponent(DTCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        'aria-label': 'Select row',
        class: 'translate-y-[2px]'
      }),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<DepartmentPageSchema, unknown>, {
        column,
        title: 'ID'
      });
    },
    cell: ({ row }) => {
      const idSnippet = createRawSnippet<[string]>((getId) => {
        return {
          render: () => `<div class="w-[80px]">${getId()}</div>`
        };
      });

      return renderSnippet(idSnippet, row.getValue('id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'code',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<DepartmentPageSchema, unknown>, {
        column,
        title: 'Department Code'
      });
    },
    cell: ({ row }) => {
      const departmentCodeSnip = createRawSnippet<[string]>((getDepCode) => {
        return {
          render: () => `<div class="w-[80px]">${getDepCode()}</div>`
        };
      });

      return renderSnippet(departmentCodeSnip, row.getValue('code'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'name',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<DepartmentPageSchema, unknown>, {
        column,
        title: 'Course Name'
      });
    },
    cell: ({ row }) => {
      const nameSnip = createRawSnippet<[string]>((getName) => {
        return {
          render: () => `<div class="w-full">${getName()}</div>`
        };
      });

      return renderSnippet(nameSnip, row.getValue('name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'color',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<DepartmentPageSchema, unknown>, {
        column,
        title: 'Department Color'
      });
    },
    cell: ({ row }) => {
      const colorSnip = createRawSnippet<[string]>((getColor) => {
        return {
          render: () =>
            `<div class="size-5 rounded-full" style="background-color: ${getColor()}"></div>`
        };
      });

      return renderSnippet(colorSnip, row.getValue('color'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<DepartmentPageSchema, unknown>, {
        column,
        title: 'Created At'
      });
    },
    cell: ({ row }) => {
      const createdAtSnip = createRawSnippet<[string]>((getCreatedAt) => {
        return {
          render: () =>
            `<div class="w-full">${new Date(getCreatedAt()).toLocaleDateString()} @ ${new Date(getCreatedAt()).toLocaleTimeString()}</div>`
        };
      });

      return renderSnippet(createdAtSnip, row.getValue('created_at'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    id: 'actions',
    cell: ({ row }) => renderComponent(RowActions<DepartmentPageSchema>, { row })
  }
];

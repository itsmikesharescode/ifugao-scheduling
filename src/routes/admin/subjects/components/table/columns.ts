import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { SubjectPageSchema } from './schema';
import { DTColumnHeader } from '$lib/components/ui/data-table/components/index.js';
import RowActions from './row-actions.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<SubjectPageSchema>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SubjectPageSchema, unknown>, {
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
      return renderComponent(DTColumnHeader<SubjectPageSchema, unknown>, {
        column,
        title: 'Course Code'
      });
    },
    cell: ({ row }) => {
      const courseCodeSnip = createRawSnippet<[string]>((getCourseCode) => {
        return {
          render: () => `<div class="w-[80px]">${getCourseCode()}</div>`
        };
      });

      return renderSnippet(courseCodeSnip, row.getValue('code'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'name',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SubjectPageSchema, unknown>, {
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
    accessorKey: 'created_at',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SubjectPageSchema, unknown>, {
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
    cell: ({ row }) => renderComponent(RowActions<SubjectPageSchema>, { row })
  }
];

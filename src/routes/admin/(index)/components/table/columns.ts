import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { SubjectPageSchema } from './schema';
import { DTCheckbox, DTColumnHeader } from '$lib/components/ui/data-table/components/index.js';
import RowActions from './row-actions.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<SubjectPageSchema>[] = [
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
      return renderComponent(DTColumnHeader<SubjectPageSchema, unknown>, {
        column,
        title: 'ID'
      });
    },
    cell: ({ row }) => {
      const idSnippet = createRawSnippet<[string]>((getId) => {
        const id = getId();
        return {
          render: () => `<div class="w-[80px]">${id}</div>`
        };
      });

      return renderSnippet(idSnippet, row.getValue('id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'course_code',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SubjectPageSchema, unknown>, {
        column,
        title: 'Course Code'
      });
    },
    cell: ({ row }) => {
      const courseCodeSnip = createRawSnippet<[string]>((getCourseCode) => {
        const id = getCourseCode();
        return {
          render: () => `<div class="w-[80px]">${id}</div>`
        };
      });

      return renderSnippet(courseCodeSnip, row.getValue('course_code'));
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
        const id = getName();
        return {
          render: () => `<div class="w-full">${id}</div>`
        };
      });

      return renderSnippet(nameSnip, row.getValue('name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    id: 'actions',
    cell: ({ row }) => renderComponent(RowActions<SubjectPageSchema>, { row })
  }
];

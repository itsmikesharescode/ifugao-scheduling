import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { SchedulePageSchema } from './schema';
import { DTCheckbox, DTColumnHeader } from '$lib/components/ui/data-table/components/index.js';
import { RowActions, DisplayDepartment, DisplayFaculty } from './components/index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<SchedulePageSchema>[] = [
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
      return renderComponent(DTColumnHeader<SchedulePageSchema, unknown>, {
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
    accessorKey: 'department_id',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SchedulePageSchema, unknown>, {
        column,
        title: 'Department'
      });
    },
    cell: ({ row }) => renderComponent(DisplayDepartment<SchedulePageSchema>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'faculty_id',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SchedulePageSchema, unknown>, {
        column,
        title: 'Fullname'
      });
    },
    cell: ({ row }) => renderComponent(DisplayFaculty<SchedulePageSchema>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'semester',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SchedulePageSchema, unknown>, {
        column,
        title: 'Semester'
      });
    },
    cell: ({ row }) => {
      const semesterSnip = createRawSnippet<[string]>((getSemester) => {
        return {
          render: () => `<div class="w-full">${getSemester()}</div>`
        };
      });

      return renderSnippet(semesterSnip, row.getValue('semester'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'school_year',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SchedulePageSchema, unknown>, {
        column,
        title: 'School Year'
      });
    },
    cell: ({ row }) => {
      const schoolYearSnip = createRawSnippet<[string]>((getSchoolYear) => {
        return {
          render: () => `<div class="w-full">${getSchoolYear()}</div>`
        };
      });

      return renderSnippet(schoolYearSnip, row.getValue('school_year'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<SchedulePageSchema, unknown>, {
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
    cell: ({ row }) => renderComponent(RowActions<SchedulePageSchema>, { row })
  }
];

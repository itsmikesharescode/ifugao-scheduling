import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { FacultyPageSchema } from './schema';
import { DTColumnHeader } from '$lib/components/ui/data-table/components/index.js';
import RowActions from './row-actions.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<FacultyPageSchema>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'ID'
      });
    },
    cell: ({ row }) => {
      const idSnippet = createRawSnippet<[string]>((getId) => {
        return {
          render: () => `<div class="truncate w-full">${getId()}</div>`
        };
      });

      return renderSnippet(idSnippet, row.getValue('id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'First Name'
      });
    },
    cell: ({ row }) => {
      const firstnameSnip = createRawSnippet<[string]>((getFirstName) => {
        return {
          render: () => `<div class="truncate w-full">${getFirstName()}</div>`
        };
      });

      return renderSnippet(firstnameSnip, row.getValue('first_name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'middle_name',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'Middle Name'
      });
    },
    cell: ({ row }) => {
      const middlenameSnip = createRawSnippet<[string]>((getMiddleName) => {
        return {
          render: () => `<div class="truncate w-full">${getMiddleName()}</div>`
        };
      });

      return renderSnippet(middlenameSnip, row.getValue('middle_name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'last_name',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'Last Name'
      });
    },
    cell: ({ row }) => {
      const lastnameSnip = createRawSnippet<[string]>((getLastname) => {
        return {
          render: () => `<div class="truncate w-full">${getLastname()}</div>`
        };
      });

      return renderSnippet(lastnameSnip, row.getValue('last_name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'gender',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'Gender'
      });
    },
    cell: ({ row }) => {
      const genderSnip = createRawSnippet<[string]>((getGender) => {
        return {
          render: () => `<div class="truncate w-full">${getGender()}</div>`
        };
      });

      return renderSnippet(genderSnip, row.getValue('gender'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'academic_rank',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'Academic Rank'
      });
    },
    cell: ({ row }) => {
      const academicRankSnip = createRawSnippet<[string]>((getAcademicRank) => {
        return {
          render: () => `<div class="truncate w-full">${getAcademicRank()}</div>`
        };
      });

      return renderSnippet(academicRankSnip, row.getValue('academic_rank'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'birth_date',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'Birth Date'
      });
    },
    cell: ({ row }) => {
      const birthDateSnip = createRawSnippet<[string]>((getBirthDate) => {
        return {
          render: () =>
            `<div class="truncate w-full">${new Date(getBirthDate()).toLocaleDateString()}</div>`
        };
      });

      return renderSnippet(birthDateSnip, row.getValue('birth_date'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'status',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<FacultyPageSchema, unknown>, {
        column,
        title: 'Status'
      });
    },
    cell: ({ row }) => {
      const statusSnip = createRawSnippet<[string]>((getStatus) => {
        return {
          render: () => `<div class="truncate w-full">${getStatus()}</div>`
        };
      });

      return renderSnippet(statusSnip, row.getValue('status'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    id: 'actions',
    cell: ({ row }) => renderComponent(RowActions<FacultyPageSchema>, { row })
  }
];

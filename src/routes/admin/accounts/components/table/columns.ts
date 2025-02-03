import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { AccountsPageSchema } from './schema';
import { DTColumnHeader } from '$lib/components/ui/data-table/components/index.js';
import RowActions from './row-actions.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<AccountsPageSchema>[] = [
  {
    id: 'actions',
    cell: ({ row }) => renderComponent(RowActions<AccountsPageSchema>, { row })
  },

  {
    accessorKey: 'operational',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Operational'
      });
    },
    cell: ({ row }) => {
      const operationalSnip = createRawSnippet<[string]>((getOperational) => {
        return {
          render: () =>
            `<div class="w-[80px] ${getOperational() === 'activated' ? 'text-green-600' : 'text-red-600'}">${getOperational()}</div>`
        };
      });

      return renderSnippet(operationalSnip, row.getValue('operational'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'avatar',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Avatar'
      });
    },
    cell: ({ row }) => {
      const firstNameSnip = createRawSnippet<[string]>((getFirstName) => {
        return {
          render: () =>
            `<img src=${getFirstName()} alt="profile photo" class="size-10 bg-secondary rounded-full p-2" />`
        };
      });

      return renderSnippet(firstNameSnip, row.getValue('avatar'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'firstname',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'First Name'
      });
    },
    cell: ({ row }) => {
      const firstNameSnip = createRawSnippet<[string]>((getFirstName) => {
        return {
          render: () => `<div class="w-[80px]">${getFirstName()}</div>`
        };
      });

      return renderSnippet(firstNameSnip, row.getValue('firstname'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'middlename',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Middle Name'
      });
    },
    cell: ({ row }) => {
      const middleNameSnip = createRawSnippet<[string]>((getMiddleName) => {
        return {
          render: () => `<div class="w-[80px]">${getMiddleName()}</div>`
        };
      });

      return renderSnippet(middleNameSnip, row.getValue('middlename'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'lastname',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Last Name'
      });
    },
    cell: ({ row }) => {
      const lastNameSnip = createRawSnippet<[string]>((getLastName) => {
        return {
          render: () => `<div class="w-[80px]">${getLastName()}</div>`
        };
      });

      return renderSnippet(lastNameSnip, row.getValue('lastname'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'gender',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Gender'
      });
    },
    cell: ({ row }) => {
      const genderSnip = createRawSnippet<[string]>((getGender) => {
        return {
          render: () => `<div class="w-[80px]">${getGender()}</div>`
        };
      });

      return renderSnippet(genderSnip, row.getValue('gender'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'birth_date',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Birth Date'
      });
    },
    cell: ({ row }) => {
      const birthDateSnip = createRawSnippet<[string]>((getBirthDate) => {
        return {
          render: () => `<div class="w-[80px]">${getBirthDate()}</div>`
        };
      });

      return renderSnippet(birthDateSnip, row.getValue('birth_date'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'academic_rank',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Academic Rank'
      });
    },
    cell: ({ row }) => {
      const academicRankSnip = createRawSnippet<[string]>((getAcademicRank) => {
        return {
          render: () => `<div class="w-[80px]">${getAcademicRank()}</div>`
        };
      });

      return renderSnippet(academicRankSnip, row.getValue('academic_rank'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'department',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Department'
      });
    },
    cell: ({ row }) => {
      const departmentSnip = createRawSnippet<[string]>((getDepartment) => {
        return {
          render: () => `<div class="w-[80px]">${getDepartment()}</div>`
        };
      });

      return renderSnippet(departmentSnip, row.getValue('department'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'status',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Status'
      });
    },
    cell: ({ row }) => {
      const statusSnip = createRawSnippet<[string]>((getStatus) => {
        return {
          render: () => `<div class="w-[80px]">${getStatus()}</div>`
        };
      });

      return renderSnippet(statusSnip, row.getValue('status'));
    },
    enableSorting: true,
    enableHiding: true
  }
];

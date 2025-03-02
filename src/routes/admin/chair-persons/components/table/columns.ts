import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { AccountsPageSchema } from './schema';
import { DTColumnHeader } from '$lib/components/ui/data-table/components/index.js';
import { RowActions, Departments, Avatar } from './components/index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<AccountsPageSchema>[] = [
  {
    accessorKey: 'avatar_path',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Avatar',
        class: 'truncate w-full'
      });
    },
    cell: ({ row }) => renderComponent(Avatar<AccountsPageSchema>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'email',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Email',
        class: 'truncate w-full'
      });
    },
    cell: ({ row }) => {
      const emailSnip = createRawSnippet<[string]>((getEmail) => {
        return {
          render: () => `<div class="max-w-fit">${getEmail()}</div>`
        };
      });

      return renderSnippet(emailSnip, row.getValue('email'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'firstname',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'First Name',
        class: 'truncate w-full'
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
        title: 'Middle Name',
        class: 'truncate w-full'
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
        title: 'Last Name',
        class: 'truncate w-full'
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
        title: 'Gender',
        class: 'truncate w-full'
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
        title: 'Birth Date',
        class: 'truncate w-full'
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
        title: 'Academic Rank',
        class: 'truncate w-full'
      });
    },
    cell: ({ row }) => {
      const academicRankSnip = createRawSnippet<[string]>((getAcademicRank) => {
        return {
          render: () => `<div class="w-full">${getAcademicRank()}</div>`
        };
      });

      return renderSnippet(academicRankSnip, row.getValue('academic_rank'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'departments',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Department',
        class: 'truncate w-full'
      });
    },
    cell: ({ row }) => renderComponent(Departments<AccountsPageSchema>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'status',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Status',
        class: 'truncate w-full'
      });
    },
    cell: ({ row }) => {
      const statusSnip = createRawSnippet<[string]>((getStatus) => {
        return {
          render: () => `<div class="w-full truncate">${getStatus()}</div>`
        };
      });

      return renderSnippet(statusSnip, row.getValue('status'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return renderComponent(DTColumnHeader<AccountsPageSchema, unknown>, {
        column,
        title: 'Created At',
        class: 'truncate w-full'
      });
    },
    cell: ({ row }) => {
      const createdAtSnip = createRawSnippet<[string]>((getCreatedAt) => {
        return {
          render: () =>
            `<div class="w-full truncate">${new Date(getCreatedAt()).toLocaleDateString()} @ ${new Date(getCreatedAt()).toLocaleTimeString()}</div>`
        };
      });

      return renderSnippet(createdAtSnip, row.getValue('created_at'));
    },
    enableSorting: true,
    enableHiding: true
  },
  {
    id: 'actions',
    cell: ({ row }) => renderComponent(RowActions<AccountsPageSchema>, { row })
  }
];

<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateAccount from './components/create-account/create-account.svelte';
  import DeleteAccount from './components/delete-account/delete-account.svelte';
  import EditAccount from './components/edit-account/edit-account.svelte';
  import EditOperational from './components/edit-operational/edit-operational.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import { urlParamStacker } from '$lib/utils';
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';

  const { data } = $props();

  initTableState();

  const generateMockData = (count: number) => {
    const departments = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
    const academicRanks = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
    const firstNames = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    const middleNames = [
      'Baguinaon',
      'Cortez',
      'Delos Santos',
      'Estacio',
      'Fernandez',
      'Gutierrez'
    ];
    const genders = ['Male', 'Female'];

    return Array.from({ length: count }, (_, i) => {
      const department = departments[Math.floor(Math.random() * departments.length)];
      const birthDate = new Date(
        Date.now() - Math.floor((25 + Math.random() * 40) * 365 * 24 * 60 * 60 * 1000)
      );
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      return {
        user_id: `USER-${department.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}`,
        firstname: firstName,
        middlename: middleName,
        lastname: lastName,
        email: `${firstName.toLowerCase()}.${middleName.charAt(0).toLowerCase()}.${lastName.toLowerCase()}@university.edu.ph`,
        gender: genders[Math.floor(Math.random() * genders.length)],
        birth_date: birthDate.toISOString().split('T')[0],
        academic_rank: academicRanks[Math.floor(Math.random() * academicRanks.length)],
        department_name: department,
        departments: Array.from(
          {
            length: Math.floor(Math.random() * 11) // Random array length 0-10
          },
          () => Math.floor(Math.random() * 9)
        ),
        status: ['COS', 'TOP', 'RUP'][Math.floor(Math.random() * 3)],
        operational: ['activated', 'pending'][Math.floor(Math.random() * 2)],
        created_at: new Date().toISOString()
      };
    });
  };
</script>

<main class="flex flex-col gap-4">
  <section class="flex items-center justify-between">
    <div class="grid grid-cols-[auto_1fr] items-center gap-2">
      <Label>Filter by Department:</Label>
      <DepartmentPager />
    </div>

    <Button size="sm" href={urlParamStacker('mode', 'create', page)}>
      Create Chair Person
      <Plus />
    </Button>
  </section>
  <DataTable data={generateMockData(60)} {columns} />
</main>

<CreateAccount createAccountForm={data.createAccountForm} />

<EditAccount
  editEmailForm={data.editEmailForm}
  editInformationForm={data.editInformationForm}
  editPasswordForm={data.editPasswordForm}
/>

<EditOperational editOperationalForm={data.editOperationalForm} />
<DeleteAccount deleteAccountForm={data.deleteAccountForm} />

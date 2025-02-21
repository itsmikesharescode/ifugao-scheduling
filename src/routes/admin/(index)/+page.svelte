<script lang="ts">
  import { page } from '$app/state';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import { urlParamStacker } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import Plus from 'lucide-svelte/icons/plus';
  import CreateDepartment from './components/forms/create-department/create-department.svelte';
  import UpdateDepartment from './components/forms/update-department/update-department.svelte';
  import DeleteDepartment from './components/forms/delete-department/delete-department.svelte';

  const { data } = $props();

  initTableState();

  const generateMockData = (count: number) => {
    const departments = [
      { code: 'GEO', name: 'Geometry' },
      { code: 'MAT', name: 'Mathematics' },
      { code: 'PHY', name: 'Physics' },
      { code: 'CHE', name: 'Chemistry' },
      { code: 'BIO', name: 'Biology' }
    ];

    const getRandomColor = () =>
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');

    return Array.from({ length: count }, (_, i) => {
      const department = departments[Math.floor(Math.random() * departments.length)];
      return {
        id: i,
        created_at: new Date(
          Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        code: `${department.code}${Math.floor(100 + Math.random() * 900)}`,
        name: `${department.name} ${['Computer', 'Engineering', 'Linguistics', 'Calesthenics'][Math.floor(Math.random() * 4)]}`,
        color: getRandomColor()
      };
    });
  };
</script>

<main class="flex flex-col gap-4">
  <Button size="sm" href={urlParamStacker('mode', 'create', page)} class="ml-auto">
    Create Department
    <Plus />
  </Button>
  <DataTable data={generateMockData(60)} {columns} />
</main>

<CreateDepartment createDepForm={data.createDepartmentForm} />
<UpdateDepartment updateDepForm={data.editDepartmentForm} />
<DeleteDepartment deleteDepForm={data.deleteDepartmentForm} />

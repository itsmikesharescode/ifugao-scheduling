<script lang="ts">
  import { page } from '$app/state';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateEditDeleteDepartment from './components/create-edit-delete-department/create-edit-delete-department.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import { urlParamStacker } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import Plus from 'lucide-svelte/icons/plus';

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
        department_code: `${department.code}${Math.floor(100 + Math.random() * 900)}`,
        name: `${department.name} ${['Computer', 'Engineering', 'Linguistics', 'Calesthenics'][Math.floor(Math.random() * 4)]}`,
        color: getRandomColor()
      };
    });
  };

  const detectMode = $derived(page.url.searchParams.get('mode')) as
    | 'create'
    | 'edit'
    | 'delete'
    | null;
</script>

<main>
  <Button size="sm" href={urlParamStacker('mode', 'create', page)}>
    Create
    <Plus />
  </Button>
  <DataTable data={generateMockData(60)} {columns} />
</main>

{#if detectMode}
  <CreateEditDeleteDepartment
    createDepartmentForm={data.createDepartmentForm}
    editDepartmentForm={data.editDepartmentForm}
    deleteDepartmentForm={data.deleteDepartmentForm}
    mode={detectMode ?? 'edit'}
    open={!!detectMode}
  />
{/if}

<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateDepartment from './components/create-department/create-department.svelte';
  import DeleteSubject from './components/delete-subject/delete-subject.svelte';
  import EditSubject from './components/edit-subject/edit-subject.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';

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
</script>

<main>
  <CreateDepartment createDepartmentForm={data.createDepartmentForm} />
  <DataTable data={generateMockData(60)} {columns} />
</main>

<!-- <EditSubject editSubjectForm={data.editSubjectForm} />
<DeleteSubject deleteSubjectForm={data.deleteSubjectForm} /> -->

<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateSubject from './components/create-subject/create-subject.svelte';
  import DeleteSubject from './components/delete-subject/delete-subject.svelte';
  import EditSubject from './components/edit-subject/edit-subject.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';

  const { data } = $props();

  initTableState();

  const generateMockData = (count: number) => {
    const subjects = [
      { code: 'GEO', name: 'Geometry' },
      { MAT: 'MAT', name: 'Mathematics' },
      { PHY: 'PHY', name: 'Physics' },
      { CHE: 'CHE', name: 'Chemistry' },
      { BIO: 'BIO', name: 'Biology' }
    ];

    return Array.from({ length: count }, (_, i) => {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      return {
        id: i,
        created_at: new Date(
          Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        course_code: `${subject.code}${Math.floor(100 + Math.random() * 900)}`,
        name: `${subject.name} ${['Fundamentals', 'Principles', 'Advanced', 'Applied'][Math.floor(Math.random() * 4)]}`
      };
    });
  };
</script>

<main>
  <CreateSubject createSubjectForm={data.createSubjectForm} />
  <DataTable data={generateMockData(60)} {columns} />
</main>

<EditSubject editSubjectForm={data.editSubjectForm} />
<DeleteSubject deleteSubjectForm={data.deleteSubjectForm} />

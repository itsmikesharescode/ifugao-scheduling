<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateSection from './components/create-section/create-section.svelte';
  import EditSection from './components/edit-section/edit-section.svelte';
  import DeleteSection from './components/delete-section/delete-section.svelte';
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
        name: `${subject.name} ${['Fundamentals', 'Principles', 'Advanced', 'Applied'][Math.floor(Math.random() * 4)]}`
      };
    });
  };
</script>

<main>
  <CreateSection createSectionForm={data.createSectionForm} />
  <DataTable data={generateMockData(60)} {columns} />
</main>

<EditSection editSectionForm={data.editSectionForm} />
<DeleteSection deleteSectionForm={data.deleteSectionForm} />

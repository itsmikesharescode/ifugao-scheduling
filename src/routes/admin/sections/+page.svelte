<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import CreateEditDeleteSection from './components/create-edit-delete-section/create-edit-delete-section.svelte';
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { urlParamStacker } from '$lib/utils';

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

  const detectMode = $derived(page.url.searchParams.get('mode')) as 'create' | 'edit' | 'delete';
</script>

<main>
  <Button size="sm" href={urlParamStacker('mode', 'create', page)}>
    Create
    <Plus />
  </Button>
  <DataTable data={generateMockData(60)} {columns} />
</main>

{#if detectMode}
  <CreateEditDeleteSection
    open={detectMode !== null}
    createSectionForm={data.createSectionForm}
    editSectionForm={data.editSectionForm}
    deleteSectionForm={data.deleteSectionForm}
    mode={detectMode ?? 'edit'}
  />
{/if}

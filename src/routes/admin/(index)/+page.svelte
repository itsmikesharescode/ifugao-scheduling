<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { urlParamStacker } from '$lib/utils';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import CreateEditDeleteSubject from './components/create-edit-delete-subject/create-edit-delete-subject.svelte';

  const { data } = $props();

  initTableState();

  const generateMockData = (count: number) => {
    const subjects = [
      { code: 'GEO', name: 'Geometry' },
      { code: 'MAT', name: 'Mathematics' },
      { code: 'PHY', name: 'Physics' },
      { code: 'CHE', name: 'Chemistry' },
      { code: 'BIO', name: 'Biology' }
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
  <CreateEditDeleteSubject
    open={!!detectMode}
    createSubjectForm={data.createSubjectForm}
    editSubjectForm={data.editSubjectForm}
    deleteSubjectForm={data.deleteSubjectForm}
    mode={detectMode}
  />
{/if}

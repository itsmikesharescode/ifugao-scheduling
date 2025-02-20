<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { urlParamStacker } from '$lib/utils';
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import CreateSection from './components/forms/create-section/create-section.svelte';
  import UpdateSection from './components/forms/update-section/update-section.svelte';
  import DeleteSection from './components/forms/delete-section/delete-section.svelte';
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
        name: `${subject.name} ${['Fundamentals', 'Principles', 'Advanced', 'Applied'][Math.floor(Math.random() * 4)]}`,
        departments: Array.from(
          {
            length: Math.floor(Math.random() * 11) // Random array length 0-10
          },
          () => Math.floor(Math.random() * 9)
        )
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
      Create Section
      <Plus />
    </Button>
  </section>

  <DataTable data={generateMockData(60)} {columns} />
</main>

<CreateSection createSecForm={data.createSecForm} />
<UpdateSection updateSecForm={data.updateSecForm} />
<DeleteSection deleteSecForm={data.deleteSecForm} />

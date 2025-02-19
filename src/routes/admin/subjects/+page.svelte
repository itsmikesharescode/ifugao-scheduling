<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { urlParamStacker } from '$lib/utils';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import CreateSubject from './components/forms/create-subject/create-subject.svelte';
  import UpdateSubject from './components/forms/update-subject/update-subject.svelte';
  import DeleteSubject from './components/forms/delete-subject/delete-subject.svelte';

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
        name: `${subject.name} ${['Fundamentals', 'Principles', 'Advanced', 'Applied'][Math.floor(Math.random() * 4)]}`,
        departments: Array.from(
          {
            length: Math.floor(Math.random() * 11) // Random array length 0-10
          },
          () => Math.floor(Math.random() * 9)
        ) // Values 0-8
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
      Create Subject
      <Plus />
    </Button>
  </section>

  <DataTable data={generateMockData(60)} {columns} />
</main>

<CreateSubject createSubForm={data.createSubForm} />
<UpdateSubject updateSubForm={data.updateSubForm} />
<DeleteSubject deleteSubForm={data.deleteSubForm} />

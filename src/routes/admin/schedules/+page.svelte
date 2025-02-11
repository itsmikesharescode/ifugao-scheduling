<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateEditDeleteSchedule from './components/create-edit-delete-schedule/create-edit-delete-schedule.svelte';
  import ViewSchedule from './components/view-schedule/view-schedule.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { urlParamStacker } from '$lib/utils';

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

    const semesters = ['1st', '2nd', 'Summer'];
    const firstNames = ['John', 'Jane', 'Robert', 'Maria', 'Li'];
    const lastNames = ['Doe', 'Smith', 'Chen', 'Garcia', 'Singh'];

    return Array.from({ length: count }, (_, i) => {
      const department = departments[Math.floor(Math.random() * departments.length)];
      const startYear = 2020 + Math.floor(Math.random() * 5);

      return {
        id: i,
        created_at: new Date().toISOString(),
        user_id: `user_${Math.random().toString(36).substr(2, 9)}`,
        user_fullname: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
          lastNames[Math.floor(Math.random() * lastNames.length)]
        }`,
        department_id: Math.floor(1 + Math.random() * 10),
        department_name: department.name,
        semester: semesters[Math.floor(Math.random() * semesters.length)],
        school_year: `${startYear}-${startYear + 1}`,
        dynamic_form: Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => ({
          code: `${department.code}${Math.floor(100 + Math.random() * 10)}`,
          section_id: Math.floor(1 + Math.random() * 10),
          subject_id: Math.floor(1 + Math.random() * 10),
          units: Math.floor(1 + Math.random() * 4),
          num_of_hours: {
            lecture: Math.floor(1 + Math.random() * 3),
            lab: Math.floor(1 + Math.random() * 3)
          }
        }))
      };
    });
  };

  $effect(() => {
    console.log(generateMockData(20));
  });

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

<CreateEditDeleteSchedule
  createScheduleForm={data.createScheduleForm}
  editScheduleForm={data.editScheduleForm}
  deleteScheduleForm={data.deleteScheduleForm}
  mode={detectMode ?? 'edit'}
  open={detectMode !== null}
/>

<ViewSchedule />

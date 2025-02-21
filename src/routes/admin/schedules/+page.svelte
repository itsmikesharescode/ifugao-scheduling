<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import ViewSchedule from './components/view-schedule/view-schedule.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { urlParamStacker } from '$lib/utils';
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import PrintAllSchedule from './components/print-all-schedule/print-all-schedule.svelte';
  import CreateSchedule from './components/forms/create-schedule/create-schedule.svelte';
  import UpdateSchedule from './components/forms/update-schedule/update-schedule.svelte';
  import DeleteSchedule from './components/forms/delete-schedule/delete-schedule.svelte';

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
</script>

<main class="flex flex-col gap-4">
  <section class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="grid grid-cols-[auto_1fr] items-center gap-2">
        <Label>Filter by Department:</Label>
        <DepartmentPager />
      </div>

      <PrintAllSchedule />
    </div>

    <Button size="sm" href={urlParamStacker('mode', 'create', page)}>
      Create Schedule
      <Plus />
    </Button>
  </section>
  <DataTable data={generateMockData(60)} {columns} />
</main>

<CreateSchedule createSchedForm={data.createSchedForm} />
<UpdateSchedule updateSchedForm={data.updateSchedForm} />
<DeleteSchedule deleteSchedForm={data.deleteSchedForm} />
<ViewSchedule />

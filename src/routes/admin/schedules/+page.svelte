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

  $effect(() => {
    console.log(data.schedules);
  });
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
  <DataTable data={data.schedules ?? []} {columns} />
</main>

<CreateSchedule createSchedForm={data.createSchedForm} />
<UpdateSchedule updateSchedForm={data.updateSchedForm} />
<DeleteSchedule deleteSchedForm={data.deleteSchedForm} />
<ViewSchedule />

<script lang="ts" module>
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { urlParamStacker } from '$lib/utils';
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import GeneralPrinting from './components/toolbars/general-printing.svelte';
  import CreateSchedule from './components/forms/create-schedule/create-schedule.svelte';
  import UpdateSchedule from './components/forms/update-schedule/update-schedule.svelte';
  import DeleteSchedule from './components/forms/delete-schedule/delete-schedule.svelte';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import ViewSchedule from './components/view-schedule/view-schedule.svelte';
  import { columns } from './components/table/columns';
</script>

<script lang="ts">
  import { initSchedTableState, useSchedTableState } from './components/table/state.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  const { data } = $props();

  initSchedTableState();

  const tableState = useSchedTableState();
</script>

<main class="flex flex-col gap-4">
  <section class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="grid grid-cols-[auto_1fr] items-center gap-2">
        <Label>Filter by Department:</Label>
        <DepartmentPager />
      </div>

      <GeneralPrinting />
    </div>

    <Button size="sm" href={urlParamStacker('mode', 'create', page)}>
      Create Schedule
      <Plus />
    </Button>
  </section>
  <DataTable
    data={data.schedules ?? []}
    {columns}
    ondblclick={(v) => {
      tableState.setActiveRow(v);
      goto(urlParamStacker('mode', 'update', page));
    }}
  />
</main>

<CreateSchedule createSchedForm={data.createSchedForm} />
<UpdateSchedule updateSchedForm={data.updateSchedForm} />
<DeleteSchedule deleteSchedForm={data.deleteSchedForm} />
<ViewSchedule />

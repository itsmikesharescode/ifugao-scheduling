<script lang="ts" module>
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
</script>

<script lang="ts">
  import { urlParamStacker } from '$lib/utils';
  import { page } from '$app/state';
  import CreateFaculty from './components/forms/create-faculty/create-faculty.svelte';
  import { initTableState, useFacultyTableState } from './components/table/state.svelte';
  import UpdateFaculty from './components/forms/update-faculty/update-faculty.svelte';
  import DeleteFaculty from './components/forms/delete-faculty/delete-faculty.svelte';
  import { goto } from '$app/navigation';
  initTableState();
  const { data } = $props();
  const tableState = useFacultyTableState();
</script>

<main class="flex flex-col gap-4">
  <section class="flex items-center justify-between">
    <div class="grid grid-cols-[auto_1fr] items-center gap-2">
      <Label>Filter by Department:</Label>
      <DepartmentPager />
    </div>

    <Button size="sm" href={urlParamStacker('mode', 'create', page)}>
      Create Faculty
      <Plus />
    </Button>
  </section>
  <DataTable
    data={data.faculties ?? []}
    {columns}
    ondblclick={(v) => {
      tableState.setActiveRow(v);
      goto(urlParamStacker('mode', 'update', page));
    }}
  />
</main>

<CreateFaculty createFacForm={data.createFacForm} />
<UpdateFaculty updateFacForm={data.updateFacForm} />
<DeleteFaculty deleteFacForm={data.deleteFacForm} />

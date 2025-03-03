<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
  import { initTableState, useSectionTableState } from './components/table/state.svelte';
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { urlParamStacker } from '$lib/utils';
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import CreateSection from './components/forms/create-section/create-section.svelte';
  import UpdateSection from './components/forms/update-section/update-section.svelte';
  import DeleteSection from './components/forms/delete-section/delete-section.svelte';
  import { goto } from '$app/navigation';
  const { data } = $props();

  initTableState();
  const tableState = useSectionTableState();
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

  <DataTable
    data={data.sections ?? []}
    {columns}
    ondblclick={(v) => {
      tableState.setActiveRow(v);
      goto(urlParamStacker('mode', 'update', page));
    }}
  />
</main>

<CreateSection createSecForm={data.createSecForm} />
<UpdateSection updateSecForm={data.updateSecForm} />
<DeleteSection deleteSecForm={data.deleteSecForm} />

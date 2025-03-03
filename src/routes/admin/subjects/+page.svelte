<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { urlParamStacker } from '$lib/utils';
  import { columns } from './components/table/columns';
  import { initTableState, useSubjectTableState } from './components/table/state.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import CreateSubject from './components/forms/create-subject/create-subject.svelte';
  import UpdateSubject from './components/forms/update-subject/update-subject.svelte';
  import DeleteSubject from './components/forms/delete-subject/delete-subject.svelte';
  import { goto } from '$app/navigation';
  const { data } = $props();

  initTableState();
  const tableState = useSubjectTableState();
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

  <DataTable
    data={data.subjects ?? []}
    {columns}
    ondblclick={(v) => {
      tableState.setActiveRow(v);
      goto(urlParamStacker('mode', 'update', page));
    }}
  />
</main>

<CreateSubject createSubForm={data.createSubForm} />
<UpdateSubject updateSubForm={data.updateSubForm} />
<DeleteSubject deleteSubForm={data.deleteSubForm} />

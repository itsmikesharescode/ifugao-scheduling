<script lang="ts" module>
  import { page } from '$app/state';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
  import { urlParamStacker } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import Plus from 'lucide-svelte/icons/plus';
  import CreateDepartment from './components/forms/create-department/create-department.svelte';
  import UpdateDepartment from './components/forms/update-department/update-department.svelte';
  import DeleteDepartment from './components/forms/delete-department/delete-department.svelte';
  import { toast } from 'svelte-sonner';
  import type { RowSelectionState } from '@tanstack/table-core';

  const deleteAllSelectedDepartments = async (ids: number[]) => {
    if (!page.data.supabase) return;

    const { error } = await page.data.supabase.from('deparments_tb').delete().in('id', ids);
    console.log(error);
    if (error) return toast.error(error.message);

    return toast.success('Departments deleted successfully');
  };
</script>

<script lang="ts">
  import { initTableState } from './components/table/state.svelte';
  import { invalidateAll } from '$app/navigation';

  const { data } = $props();
  let deleteAllLoader = $state(false);
  let rowSelection = $state<RowSelectionState>({});
  initTableState();
</script>

<main class="flex flex-col gap-4">
  <Button size="sm" href={urlParamStacker('mode', 'create', page)} class="ml-auto">
    Create Department
    <Plus />
  </Button>
  <DataTable
    data={data.departments ?? []}
    {columns}
    {deleteAllLoader}
    bind:rowSelection
    onclick={async () => {
      const ids = Object.keys(rowSelection).map((v) => Number(v));
      await deleteAllSelectedDepartments(ids);
      await invalidateAll();
    }}
  />
</main>

<CreateDepartment createDepForm={data.createDepartmentForm} />
<UpdateDepartment updateDepForm={data.editDepartmentForm} />
<DeleteDepartment deleteDepForm={data.deleteDepartmentForm} />

<script lang="ts">
  import { page } from '$app/state';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';
  import { urlParamStacker } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import Plus from 'lucide-svelte/icons/plus';
  import CreateDepartment from './components/forms/create-department/create-department.svelte';
  import UpdateDepartment from './components/forms/update-department/update-department.svelte';
  import DeleteDepartment from './components/forms/delete-department/delete-department.svelte';

  const { data } = $props();

  initTableState();
</script>

<main class="flex flex-col gap-4">
  <Button size="sm" href={urlParamStacker('mode', 'create', page)} class="ml-auto">
    Create Department
    <Plus />
  </Button>
  <DataTable data={data.departments ?? []} {columns} />
</main>

<CreateDepartment createDepForm={data.createDepartmentForm} />
<UpdateDepartment updateDepForm={data.editDepartmentForm} />
<DeleteDepartment deleteDepForm={data.deleteDepartmentForm} />

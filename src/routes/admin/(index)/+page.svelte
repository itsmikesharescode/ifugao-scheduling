<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateSubject from './components/create-subject/create-subject.svelte';
  import DeleteSubject from './components/delete-subject/delete-subject.svelte';
  import EditSubject from './components/edit-subject/edit-subject.svelte';
  import { columns } from './components/table/columns';
  import { initTableState } from './components/table/state.svelte';

  const { data } = $props();

  initTableState();
</script>

<main>
  <CreateSubject createSubjectForm={data.createSubjectForm} />
  <DataTable
    data={[
      {
        id: 2,
        created_at: 'qweqwe',
        course_code: 'GEO101',
        name: 'Analytical Geometry'
      }
    ]}
    {columns}
  />
</main>

<EditSubject editSubjectForm={data.editSubjectForm} />
<DeleteSubject deleteSubjectForm={data.deleteSubjectForm} />

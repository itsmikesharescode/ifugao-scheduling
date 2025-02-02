<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import CreateSubject from './components/create-subject/create-subject.svelte';
  import { columns } from './components/table/columns';

  const { data } = $props();
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

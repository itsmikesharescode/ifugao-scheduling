<script lang="ts">
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';
</script>

<main>
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

<script lang="ts" module>
  import type { Row } from '@tanstack/table-core';
  import type { SchedulePageSchema } from '../schema';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import { page } from '$app/state';
  let { row }: { row: Row<SchedulePageSchema> } = $props();

  const getFacultyById = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('faculties_tb')
      .select('*')
      .eq('id', row.original.faculty_id)
      .single();

    if (error) return null;
    return data;
  };
</script>

{#await getFacultyById()}
  <Skeleton class="h-[20px] w-[100px] rounded-full" />
{:then faculty}
  <span>{faculty?.first_name} {faculty?.middle_name} {faculty?.last_name}</span>
{/await}

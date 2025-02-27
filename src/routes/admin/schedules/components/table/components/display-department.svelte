<script lang="ts" module>
  type TData = unknown;
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import type { Row } from '@tanstack/table-core';
  import type { SchedulePageSchema } from '../schema';
</script>

<script lang="ts" generics="TData">
  import { page } from '$app/state';

  let { row }: { row: Row<SchedulePageSchema> } = $props();

  const getDepartmentById = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('deparments_tb')
      .select('*')
      .eq('id', row.original.department_id)
      .single();

    if (error) return null;
    return data;
  };
</script>

{#await getDepartmentById()}
  <Skeleton class="h-[20px] w-[100px] rounded-full" />
{:then department}
  <div class="flex items-center gap-1">
    <div class="size-5 rounded-full" style="background: {department?.color}"></div>
    <span>{department?.code}</span>
  </div>
{/await}

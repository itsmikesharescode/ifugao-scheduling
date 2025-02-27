<script lang="ts" module>
  import type { Row } from '@tanstack/table-core';
  import type { SchedulePageSchema } from '../schema';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
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

  const getDepartmentsById = async (id: number) => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('deparments_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };

  let open = $state(false);
  let timeout: NodeJS.Timeout;

  const onMouseEnter = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      open = true;
    }, 500);
  };

  const onMouseLeave = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      open = false;
    }, 500);
  };
</script>

{#await getFacultyById()}
  <Skeleton class="h-[20px] w-[100px] rounded-full" />
{:then faculty}
  <Popover.Root bind:open>
    <Popover.Trigger class="underline" onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
      <span class="w-full truncate">
        {faculty?.first_name}
        {faculty?.middle_name}
        {faculty?.last_name}
      </span>
    </Popover.Trigger>
    <Popover.Content onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <span>Gender:</span>
          <span>{faculty?.gender}</span>
        </div>

        <div class="flex flex-col">
          <span>Academic Rank:</span>
          <span>{faculty?.academic_rank}</span>
        </div>

        <div class="flex flex-col">
          <span>Status:</span>
          <span>{faculty?.status}</span>
        </div>

        <div class="flex flex-col">
          <span>Departments:</span>
          <div class="flex flex-wrap items-center gap-2">
            {#each faculty?.departments ?? [] as departmentId}
              {#await getDepartmentsById(Number(departmentId))}
                <Skeleton class="h-[20px] w-[100px] rounded-full" />
              {:then department}
                <div class="flex items-center gap-1">
                  <div class="size-5 rounded-full" style="background: {department?.color}"></div>
                  <span>{department?.code}</span>
                </div>
              {/await}
            {/each}
          </div>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>
{/await}

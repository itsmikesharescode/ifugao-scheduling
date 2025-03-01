<script lang="ts" module>
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';
  import Printer from 'lucide-svelte/icons/printer';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import type { SchedulePageSchema } from '../table/schema';
  import { goto } from '$app/navigation';

  export type CourseSummary = {
    code: string;
    units: number;
    lectureHours: number;
    labHours: number;
    faculty_id: number;
    schoolYear: string;
    semester: string;
    days: string[];
    timeRange: string;
  };

  export type PrintingState = {
    filteredSchedules: SchedulePageSchema[] | null;
    courseSum: CourseSummary[] | null;
  };
</script>

<script lang="ts">
  const departments = $derived(page.data.departments);

  const handleRedirection = (id: number, mode: 'all' | 'first' | 'second' | 'third') => {
    goto(`/admin/schedules/print-schedules?id=${id}&mode=${mode}`);
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
    <span class="font-normal">Print Schedules</span>
    <ChevronsUpDown class="ml-auto size-4 opacity-50" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      {#each departments ?? [] as department}
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <div class="flex items-center gap-2">
              <div class="size-3 rounded-full" style="background: {department.color}"></div>
              <span class="text-sm">{department.code}</span>
            </div>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item onclick={() => handleRedirection(department.id, 'all')}>
              Print All Semesters
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={() => handleRedirection(department.id, 'first')}>
              Print First Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => handleRedirection(department.id, 'second')}>
              Print Second Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => handleRedirection(department.id, 'third')}>
              Print Third Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      {/each}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

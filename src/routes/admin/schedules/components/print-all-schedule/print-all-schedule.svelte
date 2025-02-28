<script lang="ts" module>
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';
  import type { SchedulePageSchema } from '../table/schema';
  import Printer from 'lucide-svelte/icons/printer';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
</script>

<script lang="ts">
  const allSchedules = $derived(page.data.schedules) as SchedulePageSchema[];
  const departments = $derived(page.data.departments);
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
            <DropdownMenu.Item>
              Print All Semesters
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              Print First Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Print Second Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Print Third Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      {/each}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

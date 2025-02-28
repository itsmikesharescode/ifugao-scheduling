<script lang="ts" module>
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';
  import Printer from 'lucide-svelte/icons/printer';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { SchedulePageSchema } from '../table/schema';
</script>

<script lang="ts">
  let allSchedules = $derived(page.data.schedules) as SchedulePageSchema[];
  const departments = $derived(page.data.departments);

  let open = $state(false);

  const handlePrint = (
    department: NonNullable<typeof departments>[number],
    mode: 'all' | 'first' | 'second' | 'third'
  ) => {
    open = true;

    console.log(allSchedules);
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
            <DropdownMenu.Item onclick={() => handlePrint(department, 'all')}>
              Print All Semesters
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={() => handlePrint(department, 'first')}>
              Print First Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => handlePrint(department, 'second')}>
              Print Second Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => handlePrint(department, 'third')}>
              Print Third Semester
              <Printer class="ml-auto size-4 opacity-50" />
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      {/each}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-screen h-screen">
    <Dialog.Header>
      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

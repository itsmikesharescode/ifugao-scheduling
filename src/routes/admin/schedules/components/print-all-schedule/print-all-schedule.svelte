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

  let printAllScheduleModal = $state({
    filteredSchedules: []
  });

  let open = $state(false);

  const handlePrint = (
    department: NonNullable<typeof departments>[number],
    mode: 'all' | 'first' | 'second' | 'third'
  ) => {
    open = true;

    // Filter schedules by department
    const departmentSchedules = allSchedules.filter(
      (schedule) => schedule.department_id === department.id
    );

    console.log('Department:', department.code);

    // Filter by semester if not "all"
    let filteredSchedules = departmentSchedules;
    if (mode !== 'all') {
      const semesterMap = {
        first: 'First Semester',
        second: 'Second Semester',
        third: 'Third Semester'
      };

      filteredSchedules = departmentSchedules.filter(
        (schedule) => schedule.semester === semesterMap[mode]
      );
      console.log('Semester:', semesterMap[mode]);
    } else {
      console.log('All Semesters');
    }

    // Log filtered schedules
    console.log('Filtered Schedules:', filteredSchedules);

    // Summary of courses from dynamic_form
    const coursesSummary = filteredSchedules.flatMap((schedule) =>
      schedule.dynamic_form.map((course) => ({
        code: course.code,
        units: course.units,
        lectureHours: course.num_of_hours.lecture,
        labHours: course.num_of_hours.lab,
        faculty_id: course.faculty_id,
        schoolYear: schedule.school_year,
        semester: schedule.semester,
        days: schedule.days,
        timeRange: `${new Date(schedule.start_time).toLocaleTimeString()} - ${new Date(schedule.end_time).toLocaleTimeString()}`
      }))
    );

    console.log('Courses to print:', coursesSummary);
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

<!--Printing Happens here-->
<Dialog.Root bind:open>
  <Dialog.Content class="max-w-screen h-screen">
    <Dialog.Header>
      <Dialog.Title>Schedule Printing Preview</Dialog.Title>
      <Dialog.Description>
        Preview and print class schedules for the selected department and semester.
      </Dialog.Description>
    </Dialog.Header>

    <div class="print-container overflow-auto p-4">
      <!-- Here you would render the actual schedule based on the filtered data -->
      <!-- The format would match the form shown in your attached image -->
    </div>

    <Dialog.Footer>
      <button class={buttonVariants()} onclick={() => window.print()}>
        <Printer class="mr-2 size-4" />
        Print Now
      </button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

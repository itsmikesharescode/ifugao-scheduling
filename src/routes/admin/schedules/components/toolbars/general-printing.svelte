<script lang="ts" module>
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';
  import Printer from 'lucide-svelte/icons/printer';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import PrintingTemplate from './printing-template.svelte';
  import type { SchedulePageSchema } from '../table/schema';

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
  let allSchedules = $derived(page.data.schedules) as SchedulePageSchema[];
  const departments = $derived(page.data.departments);

  let printingSchedState = $state<PrintingState>({
    filteredSchedules: null,
    courseSum: null
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

      printingSchedState.filteredSchedules = departmentSchedules.filter(
        (schedule) => schedule.semester === semesterMap[mode]
      );
      console.log('Semester:', semesterMap[mode]);
    } else {
      console.log('All Semesters');
    }

    // Log filtered schedules
    console.log('Filtered Schedules:', filteredSchedules);

    // Summary of courses from dynamic_form
    printingSchedState.courseSum = filteredSchedules.flatMap((schedule) =>
      schedule.dynamic_form.map((course) => ({
        code: course.code,
        units: course.units,
        lectureHours: course.num_of_hours.lecture,
        labHours: course.num_of_hours.lab,
        faculty_id: schedule.faculty_id,
        schoolYear: schedule.school_year,
        semester: schedule.semester,
        days: schedule.days,
        timeRange: `${new Date(schedule.start_time).toLocaleTimeString()} - ${new Date(schedule.end_time).toLocaleTimeString()}`
      }))
    );
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

<PrintingTemplate bind:open {printingSchedState} />

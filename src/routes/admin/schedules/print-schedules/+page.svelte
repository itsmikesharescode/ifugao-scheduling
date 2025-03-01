<script lang="ts" module>
  import Undo2 from 'lucide-svelte/icons/undo-2';
  import PrinterCheck from 'lucide-svelte/icons/printer-check';
  import type { ClassNameValue } from 'tailwind-merge';
  import { cn } from '$lib/utils';
  import * as Table from '$lib/components/ui/table/index.js';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import { tick } from 'svelte';
  import type { SchedulePageSchema } from '../components/table/schema';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';

  export const getFacultyNameById = async (id: number) => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('faculties_tb')
      .select('first_name, last_name, middle_name')
      .eq('id', id)
      .single();

    if (error) return null;

    return data;
  };

  export const getSubjectNameById = async (id: number) => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('subjects_tb')
      .select('name, code')
      .eq('id', id)
      .single();

    if (error) return null;

    return data;
  };
</script>

<script lang="ts">
  let isPrinting = $state(false);

  const handlePrint = async () => {
    isPrinting = true;
    await tick();
    const handleAfterPrint = () => {
      isPrinting = false;
      window.removeEventListener('afterprint', handleAfterPrint);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    print();
  };

  const allSchedules = $derived(page.data.schedules) as SchedulePageSchema[];

  const derivedSchedules = $derived.by(() => {
    const id = page.url.searchParams.get('id');
    const mode = page.url.searchParams.get('mode') as 'all' | 'first' | 'second' | 'third';

    if (!allSchedules || !page.data.departments || !id || !mode) return null;

    // Filter schedules by department
    const departmentSchedules = allSchedules.filter(
      (schedule) => schedule.department_id === Number(id)
    );

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
    }

    // Create course summary
    const courseSummary = filteredSchedules.flatMap((schedule) =>
      schedule.dynamic_form.map((course) => ({
        code: course.code,
        subject_id: course.subject_id,
        section_id: course.section_id,
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

    return {
      filteredSchedules,
      courseSummary
    };
  });

  $effect(() => {
    console.log($state.snapshot(derivedSchedules));
  });
</script>

{#snippet heading({ title, description }: { title: string; description: string })}
  <div class="grid grid-cols-[auto_1fr] items-end gap-2">
    <span class="text-sm font-medium">{title}</span>
    <div class="w-full">
      <span class="text-sm">{description}</span>
      <div class="border-b-[1px] border-muted-foreground"></div>
    </div>
  </div>
{/snippet}

{#snippet formatter({ title, class: className }: { title: string; class?: ClassNameValue })}
  <div class="flex items-center justify-center">
    <span class={cn('text-sm', className)}>{title}</span>
  </div>
{/snippet}

<main class="flex flex-col gap-5 {isPrinting ? 'p-0' : 'p-5'}">
  {#if !isPrinting}
    <div class="flex items-center justify-between">
      <Button onclick={() => goto('/admin/schedules')} variant="link">
        <Undo2 />
        Go back to Schedules
      </Button>

      <Button onclick={handlePrint}>
        <PrinterCheck />
        Print
      </Button>
    </div>
  {/if}

  <Separator />

  {#if !derivedSchedules?.filteredSchedules.length}
    <div class="flex flex-col items-center justify-center gap-5">
      <span class="text-xl font-medium text-muted-foreground">No printable schedules found</span>
    </div>
  {/if}
  {#each derivedSchedules?.filteredSchedules ?? [] as schedule, index}
    <section class="flex flex-col gap-5">
      <!--Template Header-->
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-[2fr_1fr]">
          <div class="flex">
            <div class="flex flex-col items-center justify-center">
              <img src="/favicon.png" alt="" class="mb-3 size-20 rounded-lg object-cover" />
              <span class="text-center text-sm">Republic of the Philippines</span>
              <span class="text-center text-sm">IFUGAO STATE UNIVERSITY</span>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center">
            <span class="text-2xl font-medium text-muted-foreground">CLASS SCHEDULE</span>
            <span class="text-2xl font-medium text-muted-foreground">FORM</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            {@render heading({
              title: 'Campus:',
              description: 'Lagawe Campus'
            })}
            {@render heading({
              title: 'Department:',
              description:
                page.data.departments?.filter((d) => d.id === schedule.department_id)?.[0]?.name ??
                ''
            })}
          </div>

          <div class="flex flex-col gap-2">
            {@render heading({
              title: 'Program:',
              description: `N/A`
            })}
            <div class="grid grid-cols-2 gap-4">
              {@render heading({
                title: 'Year Level:',
                description: schedule.school_year
              })}

              {@render heading({
                title: 'Section:',
                description: ''
              })}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 flex flex-col items-center justify-center">
        <span class="text-xl font-medium text-muted-foreground">
          {schedule.semester} SY {`${new Date().getFullYear() - 1}-${new Date().getFullYear()}`}
        </span>
      </div>
      <!--Template Body-->
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="border-2">
              {@render formatter({ title: 'CODE' })}
            </Table.Head>
            <Table.Head class="border-2">
              {@render formatter({ title: 'COURSE CODE' })}
            </Table.Head>
            <Table.Head class="border-2">
              {@render formatter({ title: 'COURSE DESCRIPTION' })}
            </Table.Head>
            <Table.Head class="border-2">
              {@render formatter({ title: 'NO. OF UNITS' })}
            </Table.Head>
            <Table.Head class="border-2">NO. OF HOURS (LEC/LAB)</Table.Head>
            <Table.Head class="border-2">
              {@render formatter({ title: 'INSTRUCTOR' })}
            </Table.Head>
            <Table.Head class="border-2">
              {@render formatter({ title: 'SCHEDULE' })}
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each derivedSchedules?.courseSummary ?? [] as course}
            <Table.Row>
              <Table.Cell class="border-2">
                {@render formatter({ title: course.code })}
              </Table.Cell>
              <Table.Cell class="border-2">
                {#await getSubjectNameById(Number(course.subject_id))}
                  <Skeleton class="h-[20px] w-full" />
                {:then subject}
                  <span>
                    {@render formatter({ title: subject?.code ?? '' })}
                  </span>
                {/await}
              </Table.Cell>
              <Table.Cell class="border-2">
                {#await getSubjectNameById(Number(course.subject_id))}
                  <Skeleton class="h-[20px] w-full" />
                {:then subject}
                  <span>
                    {@render formatter({ title: subject?.name ?? '' })}
                  </span>
                {/await}
              </Table.Cell>
              <Table.Cell class="border-2 text-center">
                {@render formatter({ title: course.units.toString() })}
              </Table.Cell>
              <Table.Cell class="border-2 text-center">
                {@render formatter({ title: `${course.lectureHours} / ${course.labHours}` })}
              </Table.Cell>
              <Table.Cell class="border-2">
                {#await getFacultyNameById(course.faculty_id)}
                  <Skeleton class="h-[20px] w-full" />
                {:then faculty}
                  <span>
                    {faculty?.last_name},
                    {faculty?.middle_name}
                    {faculty?.first_name}
                  </span>
                {/await}
              </Table.Cell>
              <Table.Cell class="border-2">
                <div class="flex items-center gap-1">
                  {#each course.days as day}
                    <span>{day}</span>,
                  {/each}
                </div>
                <span>{course.timeRange}</span>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </section>

    {#if index !== (derivedSchedules?.filteredSchedules?.length ?? 0) - 1}
      <div class="break-after-page"></div>
    {/if}
  {/each}
</main>

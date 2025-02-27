<script lang="ts" module>
  import { buttonVariants } from '$lib/components/ui/button';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import PrinterCheck from 'lucide-svelte/icons/printer-check';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import Printer from 'lucide-svelte/icons/printer';
  import { tick, type Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import type { ClassNameValue } from 'tailwind-merge';
  import {
    getFacultybyId,
    getCoursebyId,
    getDepartmentbyId,
    getSectionbyId
  } from '../view-schedule.svelte';
  interface Props {
    heading: Snippet<[{ title: string; description: string }]>;
  }
</script>

<script lang="ts">
  import { useSchedTableState } from '../../table/state.svelte';

  const { heading }: Props = $props();

  let open = $state(false);

  const tableState = useSchedTableState();
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

  let faculty = $state<Awaited<ReturnType<typeof getFacultybyId>>>(null);

  $effect(() => {
    if (open) {
      getFacultybyId(tableState.getActiveRow()?.faculty_id ?? 0).then((v) => {
        faculty = v;
      });
    }
  });
</script>

{#snippet span({ title, class: className }: { title: string; class?: ClassNameValue })}
  <span
    class={cn(
      'flex items-center justify-center border-r-2 px-2 py-1 text-center text-xs',
      className
    )}
  >
    {title}
  </span>
{/snippet}

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants()}>
    <Printer />
    Print Teaching Form
  </Dialog.Trigger>

  <Dialog.Content class="max-w-screen flex h-screen flex-col overflow-auto">
    {#if !isPrinting}
      <Button class="max-w-fit" onclick={handlePrint}>Print Now <PrinterCheck /></Button>
    {/if}
    <div class="flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <div class="flex flex-col items-center justify-center">
          <img src="../favicon.png" alt="" class="mb-3 size-20 rounded-lg object-cover" />
          <span class="text-center text-sm">Republic of the Philippines</span>
          <span class="text-center text-sm">IFUGAO STATE UNIVERSITY</span>
        </div>

        <span class="text-2xl font-medium text-muted-foreground">FACULTY TEACHING FORM</span>
      </div>

      <div class="grid grid-cols-2">
        <div class="">
          {@render heading({
            title: 'Name of Faculty:',
            description: `${faculty?.last_name} ${faculty?.first_name} ${faculty?.middle_name}`
          })}
          {@render heading({ title: 'Academic:', description: faculty?.academic_rank ?? '' })}
          {@render heading({ title: 'Status:', description: faculty?.status ?? '' })}
        </div>
        <div class="">
          {@render heading({ title: 'Campus:', description: 'Lagawe Campus' })}

          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Departments:</span>
            <div class="flex items-center gap-2">
              {#each faculty?.departments ?? [] as department_id}
                {#await getDepartmentbyId(department_id)}
                  <Skeleton class="h-4 w-full" />
                {:then department}
                  <span class="flex items-center gap-2 text-sm">
                    {department?.code},
                  </span>
                {/await}
              {/each}
            </div>
          </div>
        </div>
      </div>

      <span class="mt-5 text-center text-lg font-medium">Second Semester SY 2021-2022</span>
      <div class="">
        <div class="grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr] border-2">
          {@render span({ title: 'CODE' })}
          {@render span({ title: 'YEAR & SECTION' })}
          {@render span({ title: 'COURSE CODE' })}
          {@render span({ title: 'COURSE DESCRIPTION' })}
          {@render span({ title: 'NO. OF UNITS' })}

          <div class="col-span-2 flex flex-col">
            <span class="border-b-2 text-center text-xs">NO. OF HOURS</span>
            <div class="grid h-full grid-cols-2">
              <span class="flex items-center justify-center border-r-2 px-2 text-center text-xs"
                >LEC</span
              >
              <span class="flex items-center justify-center px-2 text-center text-xs">LAB</span>
            </div>
          </div>
        </div>
        {#each tableState.getActiveRow()?.dynamic_form ?? [] as form}
          <div class="grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr] border-2 border-t-0">
            {@render span({ title: form.code ?? '' })}

            {#await getSectionbyId(Number(form.section_id) ?? 0)}
              <Skeleton class="h-4 w-full" />
            {:then section}
              {@render span({ title: section?.name ?? '' })}
            {/await}

            {#await getCoursebyId(Number(form.subject_id) ?? 0)}
              <Skeleton class="h-4 w-full" />
            {:then subject}
              {@render span({ title: subject?.code ?? '' })}
            {/await}

            {#await getCoursebyId(Number(form.subject_id) ?? 0)}
              <Skeleton class="h-4 w-full" />
            {:then subject}
              {@render span({ title: subject?.name ?? '' })}
            {/await}

            {@render span({ title: form.units.toString() ?? '' })}
            {@render span({ title: form.num_of_hours.lecture.toString() ?? '' })}
            {@render span({ title: form.num_of_hours.lab.toString() ?? '', class: 'border-r-0' })}
          </div>
        {/each}
        <div class="grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr] border-2 border-t-0">
          <div class="col-span-4 flex items-center justify-center border-r-2 py-1">
            <span class="text-center">TOTAL</span>
          </div>
          {@render span({
            title:
              tableState
                .getActiveRow()
                ?.dynamic_form.reduce((acc, curr) => acc + Number(curr.units), 0)
                .toString() ?? ''
          })}
          {@render span({
            title:
              tableState
                .getActiveRow()
                ?.dynamic_form.reduce((acc, curr) => acc + Number(curr.num_of_hours.lecture), 0)
                .toString() ?? ''
          })}
          {@render span({
            title:
              tableState
                .getActiveRow()
                ?.dynamic_form.reduce((acc, curr) => acc + Number(curr.num_of_hours.lab), 0)
                .toString() ?? '',
            class: 'border-r-0'
          })}
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

<script lang="ts" module>
  import * as Table from '$lib/components/ui/table/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Undo2, PrinterCheck } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import type { ClassNameValue } from 'tailwind-merge';
  import { cn } from '$lib/utils';
  import { Separator } from '$lib/components/ui/separator/index';
  import { page } from '$app/state';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';

  export const getScheduleById = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('schedules_tb')
      .select('*')
      .eq('id', id)
      .order('created_at')
      .single();

    if (error) return null;
    return data;
  };

  export const getFacultyById = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('faculties_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };

  export const getSubjectById = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('subjects_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };

  export const getSectionById = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('sections_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };
</script>

<script lang="ts">
  let isPrinting = $state(false);

  let schedules = $state<Awaited<ReturnType<typeof getScheduleById>>>(null);

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

  $effect(() => {
    if (!page.url.searchParams.get('id')) goto('/admin/schedules');

    getScheduleById(Number(page.url.searchParams.get('id'))).then((v) => {
      schedules = v;
    });
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

  <section>
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
          <span class="text-2xl font-medium text-muted-foreground">FACULTY TEACHING</span>
          <span class="text-2xl font-medium text-muted-foreground">FORM</span>
        </div>
      </div>

      {#await getFacultyById(schedules?.faculty_id ?? 0)}
        <Skeleton class="h-4 w-full" />
      {:then faculty}
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            {@render heading({
              title: 'Name Of Faculty:',
              description: `${faculty?.first_name} ${faculty?.middle_name} ${faculty?.last_name}`
            })}
            {@render heading({
              title: 'Academic Rank:',
              description: faculty?.academic_rank ?? ''
            })}

            {@render heading({
              title: 'Rank Status:',
              description: faculty?.status ?? ''
            })}
          </div>

          <div class="flex flex-col gap-2">
            {@render heading({
              title: 'Campus:',
              description: 'Lagawe Campus'
            })}

            {@render heading({
              title: 'Department',
              description: `${page.data.departments?.find((v) => v.id === schedules?.department_id)?.name}`
            })}
          </div>
        </div>
      {/await}
    </div>
    <div class="mt-5 flex flex-col items-center justify-center">
      <span class="text-xl font-medium text-muted-foreground">
        {schedules?.semester} SY {`${new Date().getFullYear() - 1}-${new Date().getFullYear()}`}
      </span>
    </div>
  </section>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="border-2">
          {@render formatter({ title: 'CODE' })}
        </Table.Head>
        <Table.Head class="border-2">
          {@render formatter({ title: 'Year & Section' })}
        </Table.Head>
        <Table.Head class="border-2">
          {@render formatter({ title: 'Course Code' })}
        </Table.Head>
        <Table.Head class="border-2">
          {@render formatter({ title: 'Course Description' })}
        </Table.Head>
        <Table.Head class="border-2">
          {@render formatter({ title: 'No. of Units' })}
        </Table.Head>
        <Table.Head class="border-2">
          {@render formatter({ title: 'No. of Hours (Lec/Lab)' })}
        </Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each schedules?.dynamic_form ?? [] as form}
        <Table.Row>
          <Table.Cell class="border-2">
            {@render formatter({ title: form.code ?? '' })}
          </Table.Cell>
          <Table.Cell class="border-2">
            {#await getSectionById(Number(form.section_id ?? 0))}
              <Skeleton class="h-4 w-full" />
            {:then section}
              {@render formatter({ title: section?.name ?? '' })}
            {/await}
          </Table.Cell>
          <Table.Cell class="border-2">
            {#await getSubjectById(Number(form.subject_id ?? 0))}
              <Skeleton class="h-4 w-full" />
            {:then subject}
              {@render formatter({ title: subject?.code ?? '' })}
            {/await}
          </Table.Cell>
          <Table.Cell class="border-2">
            {#await getSubjectById(Number(form.subject_id ?? 0))}
              <Skeleton class="h-4 w-full" />
            {:then subject}
              {@render formatter({ title: subject?.name ?? '' })}
            {/await}
          </Table.Cell>
          <Table.Cell class="border-2">
            {@render formatter({ title: form.units.toString() ?? '' })}
          </Table.Cell>
          <Table.Cell class="border-2">
            {@render formatter({
              title: `${form.num_of_hours.lab ?? ''} / ${form.num_of_hours.lecture ?? ''}`
            })}
          </Table.Cell>
        </Table.Row>
      {/each}

      <Table.Row>
        <Table.Cell class="border-b-2 border-l-2">
          {@render formatter({ title: 'TOTAL' })}
        </Table.Cell>
        <Table.Cell class="border-b-2"></Table.Cell>
        <Table.Cell class="border-b-2"></Table.Cell>
        <Table.Cell class="border-b-2"></Table.Cell>
        <Table.Cell class="border-2">
          {@render formatter({
            title: `${schedules?.dynamic_form.reduce((acc, curr) => acc + Number(curr.units), 0)}`
          })}
        </Table.Cell>
        <Table.Cell class="border-2">
          {@render formatter({
            title: `${schedules?.dynamic_form.reduce((acc, curr) => acc + Number(curr.num_of_hours.lecture), 0)} / ${schedules?.dynamic_form.reduce((acc, curr) => acc + Number(curr.num_of_hours.lab), 0)}`
          })}
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</main>

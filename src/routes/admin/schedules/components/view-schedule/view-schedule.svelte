<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import PrintTeachingForm from './components/print-teaching-form.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { urlParamReducer } from '$lib/utils';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const getSectionbyId = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('sections_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };

  const getCoursebyId = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('subjects_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };

  const getFacultybyId = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('faculties_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };

  const getDepartmentbyId = async (id: number) => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('deparments_tb')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  };
</script>

<script lang="ts">
  import { useSchedTableState } from '../table/state.svelte';

  const tableState = useSchedTableState();

  const activeRow = $derived(tableState.getActiveRow());

  const calculateUnits = () => {
    if (!activeRow) return 0;
    return activeRow.dynamic_form.map((item) => item.units).reduce((p, c) => p + c);
  };

  const calculateHours = (type: 'lecture' | 'lab') => {
    if (!activeRow) return 0;
    return activeRow.dynamic_form.map((item) => item.num_of_hours[type]).reduce((p, c) => p + c);
  };

  const open = $derived(page.url.searchParams.get('mode') === 'view');

  let faculty = $state<Awaited<ReturnType<typeof getFacultybyId>>>(null);

  $effect(() => {
    if (open) {
      const activeRow = tableState.getActiveRow();
      if (activeRow) {
        getFacultybyId(activeRow.faculty_id ?? 0).then((v) => {
          faculty = v;
        });
      } else {
        goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
      }
    }
    return () => {};
  });
</script>

{#snippet heading({ title, description }: { title: string; description: string })}
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium">{title}</span>
    <span class="text-sm">{description}</span>
  </div>
{/snippet}

<Dialog.Root
  {open}
  onOpenChange={() => {
    tableState.setActiveRow(null);
    goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
  }}
>
  <Dialog.Content class="max-h-screen max-w-7xl">
    <Dialog.Header>
      <Dialog.Title>View Schedule</Dialog.Title>
      <Dialog.Description>
        You are viewing teaching details for <span class="bg-secondary font-semibold">
          {faculty?.last_name}
          {faculty?.first_name}
          {faculty?.middle_name}
        </span>
      </Dialog.Description>

      <div class="flex flex-col gap-2 rounded-lg border-2 p-4">
        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-2 items-center">
            <div class="">
              {@render heading({
                title: 'Fullname:',
                description: `${faculty?.last_name} ${faculty?.first_name} ${faculty?.middle_name}`
              })}
              {@render heading({
                title: 'Academic Rank:',
                description: `${faculty?.academic_rank}`
              })}
              {@render heading({ title: 'Status:', description: `${faculty?.status}` })}
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
                        <div
                          class="size-4 rounded-full"
                          style="background: {department?.color ?? 'transparent'}"
                        ></div>
                        {department?.code}
                      </span>
                    {/await}
                  {/each}
                </div>
              </div>

              {@render heading({
                title: 'Semester:',
                description: `${activeRow?.semester ?? ''} @ ${activeRow?.school_year ?? ''} SY `
              })}
            </div>
          </div>
        </div>
      </div>
    </Dialog.Header>

    <ScrollArea class="max-h-[80dvh]">
      <div class="rounded-lg border-2 p-4">
        <Table.Root>
          <!-- <Table.Caption>A list of your recent invoices.</Table.Caption> -->
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-[100px]">Code</Table.Head>
              <Table.Head>Section</Table.Head>
              <Table.Head>Course Code</Table.Head>
              <Table.Head class="">Course Description</Table.Head>
              <Table.Head class="">No. Units</Table.Head>
              <Table.Head class="">Lecture</Table.Head>
              <Table.Head class="">Laboratory</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each activeRow?.dynamic_form ?? [] as form}
              <Table.Row>
                <Table.Cell class="font-medium">{form.code}</Table.Cell>
                <Table.Cell class="font-medium">
                  {#await getSectionbyId(Number(form.section_id) ?? 0)}
                    <Skeleton class="h-4 w-full" />
                  {:then section}
                    <span>{section?.name}</span>
                  {/await}
                </Table.Cell>
                <Table.Cell class="font-medium">
                  {#await getCoursebyId(Number(form.subject_id) ?? 0)}
                    <Skeleton class="h-4 w-full" />
                  {:then subject}
                    <span>{subject?.code}</span>
                  {/await}
                </Table.Cell>
                <Table.Cell class="font-medium">
                  {#await getCoursebyId(Number(form.subject_id) ?? 0)}
                    <Skeleton class="h-4 w-full" />
                  {:then subject}
                    <span>{subject?.name}</span>
                  {/await}
                </Table.Cell>
                <Table.Cell class="font-medium">{form.units}</Table.Cell>
                <Table.Cell class="font-medium">{form.num_of_hours.lecture}</Table.Cell>
                <Table.Cell class="font-medium">{form.num_of_hours.lab}</Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>

        <div class="flex flex-col p-4">
          {@render heading({ title: 'Total Units:', description: String(calculateUnits()) })}
          {@render heading({
            title: 'Total Lecture Hours:',
            description: String(calculateHours('lecture'))
          })}
          {@render heading({
            title: 'Total Laboratory Hours:',
            description: String(calculateHours('lab'))
          })}
        </div>
      </div>
    </ScrollArea>
    <div class="flex justify-end">
      <PrintTeachingForm {heading} />
    </div>
  </Dialog.Content>
</Dialog.Root>

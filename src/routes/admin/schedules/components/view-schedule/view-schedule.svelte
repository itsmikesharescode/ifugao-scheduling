<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { useTableState } from '../table/state.svelte';
  import { page } from '$app/state';
  import * as Table from '$lib/components/ui/table/index.js';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import PrintTeachingForm from './components/print-teaching-form.svelte';
  const tableState = useTableState();

  const activeRow = $derived(tableState.getActiveRow());

  //TODO: query data based in the id;s relation of table

  const getUserInformation = () => {
    if (!page.data.supabase) return null;
    //query user information
  };

  const calculateUnits = () => {
    if (!activeRow) return 0;
    return activeRow.dynamic_form.map((item) => item.units).reduce((p, c) => p + c);
  };

  const calculateHours = (type: 'lecture' | 'lab') => {
    if (!activeRow) return 0;
    return activeRow.dynamic_form.map((item) => item.num_of_hours[type]).reduce((p, c) => p + c);
  };
</script>

{#snippet heading({ title, description }: { title: string; description: string })}
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium">{title}</span>
    <span class="text-sm">{description}</span>
  </div>
{/snippet}

<Dialog.Root
  open={tableState.showView}
  onOpenChange={() => {
    tableState.showView = false;
  }}
>
  <Dialog.Content class="max-h-screen max-w-7xl">
    <Dialog.Header>
      <Dialog.Title>View Schedule</Dialog.Title>
      <Dialog.Description>
        You are viewing teaching details for <span class="bg-secondary font-semibold">
          {tableState.getActiveRow()?.user_fullname}
        </span>
      </Dialog.Description>

      <div class="flex flex-col gap-2 rounded-lg border-2 p-4">
        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-2 items-center">
            <div class="">
              {@render heading({
                title: 'Fullname:',
                description: activeRow?.user_fullname ?? ''
              })}
              {@render heading({ title: 'Academic Rank:', description: 'Instructor 1' })}
              {@render heading({ title: 'Status:', description: 'COS' })}
            </div>

            <div class="">
              {@render heading({ title: 'Campus:', description: 'Lagawe Campus' })}
              {@render heading({
                title: 'College:',
                description: 'College of Engineering and Technology'
              })}
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
                <Table.Cell class="font-medium">{form.section_id}</Table.Cell>
                <Table.Cell class="font-medium">{form.subject_id}</Table.Cell>
                <Table.Cell class="font-medium">{form.subject_id}</Table.Cell>
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
      <PrintTeachingForm />
    </div>
  </Dialog.Content>
</Dialog.Root>

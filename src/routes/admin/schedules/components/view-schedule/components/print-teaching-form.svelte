<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import PrinterCheck from 'lucide-svelte/icons/printer-check';
  import Printer from 'lucide-svelte/icons/printer';
  import { tick, type Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import type { ClassNameValue } from 'tailwind-merge';

  interface Props {
    heading: Snippet<[{ title: string; description: string }]>;
  }

  const { heading }: Props = $props();

  let open = $state(false);

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
          {@render heading({ title: 'Name of Faculty:', description: 'Eviota, Mike John B.' })}
          {@render heading({ title: 'Academic:', description: 'INSTRUCTOR 1' })}
          {@render heading({ title: 'Status:', description: 'COS' })}
        </div>
        <div class="">
          {@render heading({ title: 'Campus:', description: 'Imus Galactic Campus' })}
          {@render heading({
            title: 'College:',
            description: 'College of Engineering and Technology'
          })}
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
        {#each Array(10)}
          <div class="grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr] border-2 border-t-0">
            {@render span({ title: 'E158' })}
            {@render span({ title: 'BSIT 2' })}
            {@render span({ title: 'MATH 16' })}
            {@render span({ title: 'Applied Industrial Matchematics' })}
            {@render span({ title: '3' })}
            {@render span({ title: '3' })}
            {@render span({ title: '3', class: 'border-r-0' })}
          </div>
        {/each}
        <div class="grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr] border-2 border-t-0">
          <div class="col-span-4 flex items-center justify-center border-r-2 py-1">
            <span class="text-center">TOTAL</span>
          </div>
          {@render span({ title: '23' })}
          {@render span({ title: '21' })}
          {@render span({ title: '6', class: 'border-r-0' })}
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

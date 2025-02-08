<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import PrinterCheck from 'lucide-svelte/icons/printer-check';
  import Printer from 'lucide-svelte/icons/printer';
  import { useTableState } from '../../table/state.svelte';

  const tableState = useTableState();

  let open = $state(false);

  const handlePrint = () => {
    const handleAfterPrint = () => {
      open = false; // Close dialog when done
      window.removeEventListener('afterprint', handleAfterPrint);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    print();
  };
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants()}>
    <Printer />
    Print Teaching Form
  </Dialog.Trigger>

  <Dialog.Content class="max-w-screen flex h-screen flex-col">
    <Button class="max-w-fit" onclick={handlePrint}>Print Now <PrinterCheck /></Button>

    <span>Print template here</span>
  </Dialog.Content>
</Dialog.Root>

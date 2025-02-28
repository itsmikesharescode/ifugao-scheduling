<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { PrintingState } from './general-printing.svelte';

  interface Props {
    open: boolean;
    printingSchedState: PrintingState;
  }
</script>

<script lang="ts">
  let { open = $bindable(), printingSchedState = $bindable() }: Props = $props();
</script>

<!--Printing Happens here-->
<Dialog.Root bind:open>
  <Dialog.Content class="max-w-screen h-screen">
    {#if printingSchedState.courseSum}
      <Dialog.Header>
        <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
        <Dialog.Description>
          This action cannot be undone. This will permanently delete your account and remove your
          data from our servers.
        </Dialog.Description>
      </Dialog.Header>
    {:else}
      <Dialog.Header>
        <Dialog.Title>No courses found</Dialog.Title>
      </Dialog.Header>
    {/if}
  </Dialog.Content>
</Dialog.Root>

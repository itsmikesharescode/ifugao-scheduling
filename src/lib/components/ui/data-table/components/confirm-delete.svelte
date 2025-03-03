<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';

  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import Button from '../../button/button.svelte';
  import type { Table } from '@tanstack/table-core';

  interface Props {
    open: boolean;
    onclick: () => void;
    deleteAllLoader?: boolean;
  }

  let { open = $bindable(), onclick, deleteAllLoader }: Props = $props();

  //TODO: implement atomic deletes based in selected id;s

  //sample sort it to original then extract each id;
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete all the data you;ve selected.
      </AlertDialog.Description>
    </AlertDialog.Header>

    <!-- <div class="grid w-full items-center gap-1.5">
      <Label for="confirmdelete">Confirm Deletion</Label>
      <Input id="confirmdelete" placeholder="Please type proceed" />
    </div> -->

    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <Button variant="destructive" {onclick} disabled={deleteAllLoader} class="relative">
        <FormSpinner isLoading={deleteAllLoader ?? false} class="bg-destructive" />
        Proceed
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

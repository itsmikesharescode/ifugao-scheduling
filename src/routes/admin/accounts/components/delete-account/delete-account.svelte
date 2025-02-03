<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import { toast } from 'svelte-sonner';
  import { deleteAccountSchema, type DeleteAccountSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { useTableState } from '../table/state.svelte';
  import Button from '$lib/components/ui/button/button.svelte';

  interface Props {
    deleteAccountForm: SuperValidated<Infer<DeleteAccountSchema>>;
  }

  const { deleteAccountForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (tableState.showDelete) {
      $formData.user_id = tableState.getActiveRow()?.user_id ?? '';
      return () => form.reset();
    }
  });
</script>

<AlertDialog.Root bind:open={tableState.showDelete}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the account from our database.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <form method="post" action="?/deleteSubjectEvent" use:enhance>
        <input name="user_id" type="hidden" bind:value={$formData.user_id} />
        <Button disabled={$submitting} type="submit" variant="destructive" class="relative">
          {#if $submitting}
            <div
              class="absolute inset-0 flex items-center justify-center rounded-lg bg-destructive"
            >
              <Loader class="animate-spin" />
            </div>
          {/if}
          Continue
        </Button>
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

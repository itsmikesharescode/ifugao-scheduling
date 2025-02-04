<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import { toast } from 'svelte-sonner';
  import { deleteSectionSchema, type DeleteSectionSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { useTableState } from '../table/state.svelte';
  import Button from '$lib/components/ui/button/button.svelte';

  interface Props {
    deleteSectionForm: SuperValidated<Infer<DeleteSectionSchema>>;
  }

  const { deleteSectionForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(deleteSectionForm, {
    validators: zodClient(deleteSectionSchema),
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
      $formData.id = tableState.getActiveRow()?.id ?? 0;
      return () => form.reset();
    }
  });
</script>

<AlertDialog.Root bind:open={tableState.showDelete}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the subject from our database.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <form method="post" action="?/deleteSectionEvent" use:enhance>
        <input name="id" type="hidden" bind:value={$formData.id} />
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

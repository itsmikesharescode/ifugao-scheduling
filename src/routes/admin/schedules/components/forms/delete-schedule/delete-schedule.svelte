<script lang="ts" module>
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { deleteSchedSchema, type DeleteSchedSchema } from '../schema';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { goto } from '$app/navigation';
  import { urlParamReducer } from '$lib/utils';
  import { toast } from 'svelte-sonner';
  import * as Form from '$lib/components/ui/form/index.js';

  interface Props {
    deleteSchedForm: SuperValidated<Infer<DeleteSchedSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { useSchedTableState } from '../../table/state.svelte';
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';

  const { deleteSchedForm }: Props = $props();

  const tableState = useSchedTableState();

  const form = superForm(deleteSchedForm, {
    validators: zodClient(deleteSchedSchema),
    id: crypto.randomUUID(),
    onUpdate: async ({ result }) => {
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

  const open = $derived(page.url.searchParams.get('mode') === 'delete');

  $effect(() => {
    if (open) {
      const activeRow = tableState.getActiveRow();

      if (activeRow) {
        $formData.id = activeRow.id;
      } else {
        goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
      }

      return () => {};
    }
  });
</script>

<AlertDialog.Root
  {open}
  onOpenChange={() => {
    form.reset();
    tableState.setActiveRow(null);
    goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the schedule.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

      <form method="POST" action="?/deleteSchedEvent" use:enhance>
        <input name="id" type="hidden" value={$formData.id} />
        <Form.Button variant="destructive" disabled={$submitting} class="relative">
          <FormSpinner isLoading={$submitting} class="bg-destructive" />
          Delete
        </Form.Button>
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

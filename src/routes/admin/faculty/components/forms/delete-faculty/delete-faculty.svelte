<script lang="ts" module>
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { deleteFacSchema, type DeleteFacSchema } from '../schema';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { goto } from '$app/navigation';
  import { urlParamReducer } from '$lib/utils';
  import { toast } from 'svelte-sonner';
  import * as Form from '$lib/components/ui/form/index.js';

  interface Props {
    deleteFacForm: SuperValidated<Infer<DeleteFacSchema>>;
  }
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { useFacultyTableState } from '../../table/state.svelte';
  import FormSpinner from '$lib/components/spinners/form-spinner.svelte';

  const { deleteFacForm }: Props = $props();

  const tableState = useFacultyTableState();

  const form = superForm(deleteFacForm, {
    validators: zodClient(deleteFacSchema),
    id: crypto.randomUUID(),
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
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
        This action cannot be undone. This will permanently delete the faculty.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

      <form method="POST" action="?/deleteFacEvent" use:enhance>
        <input name="id" type="hidden" bind:value={$formData.id} />
        <Form.Button variant="destructive" disabled={$submitting} class="relative">
          <FormSpinner isLoading={$submitting} class="bg-destructive" />
          Delete
        </Form.Button>
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

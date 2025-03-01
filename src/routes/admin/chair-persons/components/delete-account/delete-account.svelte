<script lang="ts" module>
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import Loader from 'lucide-svelte/icons/loader';
  import { toast } from 'svelte-sonner';
  import { deleteAccountSchema, type DeleteAccountSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { useChairPersonTableState } from '../table/state.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { urlParamReducer } from '$lib/utils';
  interface Props {
    deleteAccountForm: SuperValidated<Infer<DeleteAccountSchema>>;
  }
</script>

<script lang="ts">
  const { deleteAccountForm }: Props = $props();

  const tableState = useChairPersonTableState();

  const form = superForm(deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
    id: crypto.randomUUID(),
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
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
      $formData.user_id = tableState.getActiveRow()?.user_id ?? '';
      $formData.avatar = tableState.getActiveRow()?.avatar ?? 'sasdasdasd-samplepath';
      return () => form.reset();
    }
  });
</script>

<AlertDialog.Root
  {open}
  onOpenChange={() => {
    tableState.setActiveRow(null);
    goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the account from our database.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <form method="post" action="?/deleteAccountEvent" use:enhance>
        <input name="user_id" type="hidden" bind:value={$formData.user_id} />
        <input name="avatar" type="hidden" bind:value={$formData.avatar} />
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

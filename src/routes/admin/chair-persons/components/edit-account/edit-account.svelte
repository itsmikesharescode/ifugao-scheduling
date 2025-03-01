<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { useChairPersonTableState } from '../table/state.svelte';
  import EditEmail from './components/edit-email.svelte';
  import type {
    EditEmailSchema,
    EditInformationSchema,
    EditPasswordSchema
  } from './components/schema';
  import EditInformation from './components/edit-information.svelte';
  import EditPassword from './components/edit-password.svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { urlParamReducer } from '$lib/utils';

  interface Props {
    editEmailForm: SuperValidated<Infer<EditEmailSchema>>;
    editInformationForm: SuperValidated<Infer<EditInformationSchema>>;
    editPasswordForm: SuperValidated<Infer<EditPasswordSchema>>;
  }
</script>

<script lang="ts">
  const { editEmailForm, editInformationForm, editPasswordForm }: Props = $props();

  const tableState = useChairPersonTableState();

  const open = $derived(page.url.searchParams.get('mode') === 'update');

  $effect(() => {
    if (open) {
      if (!tableState.getActiveRow()) goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
    }
  });
</script>

<Dialog.Root
  {open}
  onOpenChange={() => {
    tableState.setActiveRow(null);
    goto(`${page.url.pathname}?${urlParamReducer('mode', page)}`);
  }}
>
  <Dialog.Content class="flex max-h-screen max-w-7xl flex-col p-0">
    <Dialog.Header class="px-6 pt-6">
      <Dialog.Title>Edit Account</Dialog.Title>
    </Dialog.Header>
    <ScrollArea class="">
      <div class="grid max-h-[80dvh] gap-2 px-6 pb-6 md:grid-cols-[1fr,2fr] md:gap-4">
        <div class="">
          <EditEmail {editEmailForm} />
          <EditPassword {editPasswordForm} />
        </div>
        <div class="">
          <EditInformation {editInformationForm} />
        </div>
      </div>
    </ScrollArea>
  </Dialog.Content>
</Dialog.Root>

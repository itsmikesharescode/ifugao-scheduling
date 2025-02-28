<script lang="ts" module>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
</script>

<script lang="ts">
</script>

<!--Printing Happens here-->
<Dialog.Root bind:open>
  <Dialog.Content class="max-w-screen h-screen">
    <Dialog.Header>
      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

<script lang="ts">
  import UpdatePassword from './components/update-password/update-password.svelte';

  const { data } = $props();
</script>

<div class="max-w-sm">
  <UpdatePassword updatePassForm={data.updatePassForm} />
</div>

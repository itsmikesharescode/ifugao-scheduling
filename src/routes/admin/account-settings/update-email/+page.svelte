<script lang="ts">
  import UpdateEmail from './components/update-email/update-email.svelte';

  const { data } = $props();
</script>

<div class="max-w-sm">
  <UpdateEmail updateEmailForm={data.updateEmailForm} />
</div>

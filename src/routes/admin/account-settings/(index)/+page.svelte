<script lang="ts">
  import UpdateInformation from './components/update-information/update-information.svelte';

  const { data } = $props();
</script>

<div class="max-w-sm">
  <UpdateInformation updateInfoForm={data.updateInfoForm} />
</div>

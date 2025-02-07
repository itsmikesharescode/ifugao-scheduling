<script lang="ts">
  import { page } from '$app/state';
  import UpdateInformation from './components/update-information/update-information.svelte';

  const { data } = $props();

  const urlMatcher = $derived(page.url.searchParams.get('p'));
</script>

<div class="max-w-sm">
  <UpdateInformation updateInfoForm={data.updateInfoForm} />
</div>

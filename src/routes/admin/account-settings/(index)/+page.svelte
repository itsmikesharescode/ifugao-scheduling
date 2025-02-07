<script lang="ts">
  import { page } from '$app/state';

  const urlMatcher = $derived(page.url.searchParams.get('p'));
</script>

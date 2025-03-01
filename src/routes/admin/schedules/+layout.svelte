<script lang="ts">
  import { initSchedTableState } from './components/table/state.svelte';

  const { children } = $props();

  initSchedTableState();
</script>

{@render children()}

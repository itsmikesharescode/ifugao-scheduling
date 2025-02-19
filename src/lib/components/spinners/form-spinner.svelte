<script lang="ts" module>
  import Loader from 'lucide-svelte/icons/loader';
  import { cn } from '$lib/utils';
  import type { ClassNameValue } from 'tailwind-merge';

  interface Props {
    isLoading: boolean;
    class?: ClassNameValue;
  }
</script>

<script lang="ts">
  const { isLoading, class: className }: Props = $props();
</script>

{#if isLoading}
  <div
    class={cn('absolute inset-0 flex items-center justify-center rounded-lg bg-primary', className)}
  >
    <Loader class="animate-spin" />
  </div>
{/if}

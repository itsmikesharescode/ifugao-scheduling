<script lang="ts" module>
  import type { Row } from '@tanstack/table-core';
  import type { AccountsPageSchema } from '../schema';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
</script>

<script lang="ts" generics="TData">
  import { PUBLIC_SUPABASE_STORAGE_URL } from '$env/static/public';
  let { row }: { row: Row<AccountsPageSchema> } = $props();
</script>

<Avatar.Root>
  {#if row.original.avatar_path?.length}
    <Avatar.Image
      src={`${PUBLIC_SUPABASE_STORAGE_URL}/${row.original.avatar_path}?${crypto.randomUUID()}`}
      alt={row.original.firstname}
    />
  {:else}
    <Avatar.Fallback>{row.original.firstname.charAt(0)}</Avatar.Fallback>
  {/if}
</Avatar.Root>

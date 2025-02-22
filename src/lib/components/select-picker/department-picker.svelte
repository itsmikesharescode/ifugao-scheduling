<script lang="ts" module>
  import type { Database } from '$lib/database.types';
</script>

<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  interface Props {
    mode?: 'single' | 'multiple';
    departments: Database['public']['Tables']['deparments_tb']['Row'][];
    selected: {
      single?: number;
      multiple?: number[];
    };
  }

  let { selected = $bindable(), departments, mode = 'single' }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived.by(() => {
    if (mode === 'single') {
      return departments.find((item) => item.id === selected.single);
    }

    return departments.filter((item) => selected.multiple?.includes(item.id));
  });

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="h-fit w-full justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        {#if selectedValue}
          {#if Array.isArray(selectedValue)}
            <div class="flex w-full flex-wrap gap-2">
              {#if !selectedValue.length}
                <span class="text-muted-foreground">Select departments</span>
              {/if}
              {#each selectedValue as department}
                <div class="flex items-center gap-1">
                  <div class="size-5 rounded-full" style="background: {department.color}"></div>
                  <span>{department.code}</span>
                </div>
              {/each}
            </div>
          {:else}
            <span>{selectedValue.code || 'Select department'}</span>
          {/if}
        {:else}
          <span class="text-muted-foreground">Select department</span>
        {/if}

        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder="Search department..." />
      <Command.List>
        <Command.Empty>No department found.</Command.Empty>
        <Command.Group>
          {#each departments as department}
            <Command.Item
              value={department.name}
              onSelect={() => {
                if (mode === 'single') {
                  selected = {
                    single: selected.single === department.id ? undefined : department.id,
                    multiple: undefined
                  };
                } else {
                  selected = {
                    single: undefined,
                    multiple: (selected.multiple || []).includes(department.id)
                      ? (selected.multiple || []).filter((id) => id !== department.id)
                      : [...(selected.multiple || []), department.id]
                  };
                }

                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn('mr-2 size-4', {
                  'text-transparent':
                    mode === 'single'
                      ? selected.single !== department.id
                      : !(selected.multiple || []).includes(department.id)
                })}
              />
              <div class="flex flex-col">
                <div class="flex items-center gap-1">
                  <div class="size-5 rounded-full" style="background: {department.color}"></div>
                  <span class="text-sm font-medium">
                    {department.code}
                  </span>
                </div>
                <span class="text-xs text-muted-foreground">{department.name}</span>
              </div>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>

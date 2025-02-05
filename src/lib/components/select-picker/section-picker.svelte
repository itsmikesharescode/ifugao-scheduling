<script lang="ts" module>
  export type Section = {
    id: number;
    name: string;
  };
  //must only expose id
  export const sampleSecs = [
    { id: 0, name: 'BSCS-A-M' },
    { id: 1, name: 'BSCC-B-A' },
    { id: 2, name: 'BSIT-C-E' },
    { id: 3, name: 'BSCpE-D-M' },
    { id: 4, name: 'BSIS-E-A' },
    { id: 5, name: 'BSCS-F-E' },
    { id: 6, name: 'BSCC-G-M' },
    { id: 7, name: 'BSIT-H-A' },
    { id: 8, name: 'BSCpE-I-E' },
    { id: 9, name: 'BSIS-J-M' }
  ];
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
    sections: Section[];
    selected_id: number;
  }

  let { selected_id = $bindable(), sections }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(sections.find((item) => item.id === selected_id));

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
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
        class="w-full justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        <span
          class={[
            {
              'text-muted-foreground': !selectedValue?.name
            }
          ]}>{selectedValue?.name || 'Select a section...'}</span
        >
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder="Search section..." />
      <Command.List>
        <Command.Empty>No section found.</Command.Empty>
        <Command.Group>
          {#each sections as section}
            <Command.Item
              value={section.name}
              onSelect={() => {
                selected_id = section.id;
                closeAndFocusTrigger();
              }}
            >
              <Check class={cn('mr-2 size-4', selected_id !== section.id && 'text-transparent')} />
              <div class="flex flex-col">
                <span class="text-sm">{section.name}</span>
              </div>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>

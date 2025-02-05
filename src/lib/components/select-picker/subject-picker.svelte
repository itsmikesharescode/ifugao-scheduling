<script lang="ts" module>
  export type Subject = {
    id: number;
    code: string;
    name: string;
  };
  //must only expose id
  export const sampleSubs = [
    {
      id: 0,
      code: 'MENS101',
      name: 'Solid Mensuration'
    },
    {
      id: 1,
      code: 'DIFFEQ202',
      name: 'Differential Equations'
    },
    {
      id: 2,
      code: 'THERMO301',
      name: 'Thermodynamics'
    },
    {
      id: 3,
      code: 'ORGCHEM401',
      name: 'Organic Chemistry'
    },
    {
      id: 4,
      code: 'LOGIC210',
      name: 'Digital Logic Design'
    },
    {
      id: 5,
      code: 'FLUIDM320',
      name: 'Fluid Mechanics'
    },
    {
      id: 6,
      code: 'COMPARCH405',
      name: 'Computer Architecture'
    },
    {
      id: 7,
      code: 'DATASTR250',
      name: 'Data Structures'
    },
    {
      id: 8,
      code: 'CIRCUIT101',
      name: 'Electrical Circuits'
    },
    {
      id: 9,
      code: 'SOFTDES310',
      name: 'Software Design'
    }
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
    subjects: Subject[];
    selected_id: number;
  }

  let { selected_id = $bindable(), subjects }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(subjects.find((item) => item.id === selected_id));

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
          ]}>{selectedValue?.code || 'Select a department...'}</span
        >
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder="Search subject..." />
      <Command.List>
        <Command.Empty>No subject found.</Command.Empty>
        <Command.Group>
          {#each subjects as subject}
            <Command.Item
              value={subject.name}
              onSelect={() => {
                selected_id = subject.id;
                closeAndFocusTrigger();
              }}
            >
              <Check class={cn('mr-2 size-4', selected_id !== subject.id && 'text-transparent')} />
              <div class="flex flex-col">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium">
                    {subject.code}
                  </span>
                </div>
                <span class="text-xs text-muted-foreground">{subject.name}</span>
              </div>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>

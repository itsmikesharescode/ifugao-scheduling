<script lang="ts" module>
  export type Department = {
    id: number;
    code: string;
    name: string;
    color: string;
  };
  //must only expose id
  export const sampleDeps = [
    {
      id: 0,
      code: 'BSIT',
      name: 'Bachelor of Science in Information Technology',
      color: '#158932'
    },
    {
      id: 1,
      code: 'BSCS',
      name: 'Bachelor of Science in Computer Science',
      color: '#2b6cb0'
    },
    {
      id: 2,
      code: 'BSIS',
      name: 'Bachelor of Science in Information Systems',
      color: '#6b46c1'
    },
    {
      id: 3,
      code: 'BSEMC',
      name: 'Bachelor of Science in Entertainment and Multimedia Computing',
      color: '#d53f8c'
    },
    {
      id: 4,
      code: 'BSDA',
      name: 'Bachelor of Science in Data Analytics',
      color: '#3182ce'
    },
    {
      id: 5,
      code: 'BSSE',
      name: 'Bachelor of Science in Software Engineering',
      color: '#dd6b20'
    },
    {
      id: 6,
      code: 'BSA',
      name: 'Bachelor of Science in Architecture',
      color: '#48bb78'
    },
    {
      id: 7,
      code: 'BSCE',
      name: 'Bachelor of Science in Civil Engineering',
      color: '#667eea'
    },
    {
      id: 8,
      code: 'BSME',
      name: 'Bachelor of Science in Mechanical Engineering',
      color: '#c53030'
    },
    {
      id: 9,
      code: 'BSEE',
      name: 'Bachelor of Science in Electrical Engineering',
      color: '#4a5568'
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
    departments: Department[];
    selected_id: number;
  }

  let { selected_id = $bindable(), departments }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(departments.find((item) => item.id === selected_id));

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
      <Command.Input placeholder="Search department..." />
      <Command.List>
        <Command.Empty>No department found.</Command.Empty>
        <Command.Group>
          {#each departments as department}
            <Command.Item
              value={department.name}
              onSelect={() => {
                selected_id = department.id;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn('mr-2 size-4', selected_id !== department.id && 'text-transparent')}
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

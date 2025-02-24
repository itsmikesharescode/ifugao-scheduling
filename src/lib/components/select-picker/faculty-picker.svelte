<script lang="ts" module>
  import { page } from '$app/state';

  const getFaculties = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('faculties_tb')
      .select('*')
      .order('created_at');
    if (error) return null;

    return data;
  };

  const getTargetedDepartment = async (department_id: number) => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('deparments_tb')
      .select('*')
      .eq('id', department_id)
      .single();
    if (error) return null;

    return data;
  };
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
    selected: {
      single?: number;
      multiple?: number[];
    };
  }

  let { selected = $bindable(), mode = 'single' }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  let faculties = $state<Awaited<ReturnType<typeof getFaculties>>>(null);

  $effect(() => {
    getFaculties().then((data) => {
      faculties = data;
    });

    return () => {
      console.log('CLEAN UP! faculty picker');
    };
  });

  const selectedValue = $derived.by(() => {
    if (mode === 'single') {
      return faculties?.find((item) => item.id === selected.single);
    }

    return faculties?.filter((item) => selected.multiple?.includes(item.id));
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
                <span class="text-muted-foreground">Select faculties</span>
              {/if}
              {#each selectedValue as faculty}
                <div class="flex items-center gap-1">asdasdasd</div>
              {/each}
            </div>
          {:else}
            <span>
              {selectedValue.last_name +
                ' ' +
                selectedValue.middle_name +
                ' ' +
                selectedValue.first_name || 'Select faculty'}</span
            >
          {/if}
        {:else}
          <span class="text-muted-foreground">Select faculty</span>
        {/if}

        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder="Search faculty..." />
      <Command.List>
        <Command.Empty>No faculty found.</Command.Empty>
        <Command.Group>
          {#each faculties ?? [] as faculty}
            <Command.Item
              value={faculty.last_name + ' ' + faculty.middle_name + ' ' + faculty.first_name}
              onSelect={() => {
                if (mode === 'single') {
                  selected = {
                    single: selected.single === faculty.id ? undefined : faculty.id,
                    multiple: undefined
                  };
                } else {
                  selected = {
                    single: undefined,
                    multiple: (selected.multiple || []).includes(faculty.id)
                      ? (selected.multiple || []).filter((id) => id !== faculty.id)
                      : [...(selected.multiple || []), faculty.id]
                  };
                }

                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn('mr-2 size-4', {
                  'text-transparent':
                    mode === 'single'
                      ? selected.single !== faculty.id
                      : !(selected.multiple || []).includes(faculty.id)
                })}
              />
              <div class="flex flex-col">
                <span class="text-sm font-medium">
                  {faculty.last_name}, {faculty.middle_name}
                  {faculty.first_name}
                </span>
                <div class="flex flex-wrap items-center gap-2">
                  {#each faculty.departments as department_id}
                    {#await getTargetedDepartment(department_id)}
                      <span class="text-xs text-muted-foreground">Loading...</span>
                    {:then department}
                      <div class="flex items-center gap-1">
                        <div
                          class="size-5 rounded-full"
                          style="background: {department?.color ?? 'transparent'}"
                        ></div>
                        <span class="text-sm font-light text-muted-foreground">
                          {department?.code ?? ''}
                        </span>
                      </div>
                    {/await}
                  {/each}
                </div>
              </div>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>

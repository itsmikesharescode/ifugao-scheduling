<script lang="ts" module>
  export type SelectionType = {
    id: string;
    name: string;
    value: string;
  };
</script>

<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';
  import type { Snippet } from 'svelte';

  interface Props {
    selections: SelectionType[];
    selected_id: string;
    placeholder?: string;
    childLoop: Snippet<[{ props: SelectionType; selected_id: string }]>;
  }

  let {
    selected_id = $bindable(),
    selections,
    placeholder = 'Select something',
    childLoop,
    ...restProps
  }: Props = $props();

  const triggerContent = $derived.by(() => {
    if (selected_id) {
      return selections.find((item) => item.id === selected_id);
    }
    return null;
  });
</script>

<Select.Root type="single" name={placeholder} bind:value={selected_id}>
  <Select.Trigger>
    {triggerContent?.name || placeholder}
  </Select.Trigger>
  <Select.Content {...restProps}>
    <Select.Group>
      {#each selections as select}
        <Select.Item value={select.id} label={select.name}>
          {@render childLoop({ props: select, selected_id })}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>

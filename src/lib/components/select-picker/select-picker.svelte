<script lang="ts" module>
  export type SelectionType = {
    id: string;
    name: string;
    value: string;
  };
</script>

<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';

  interface Props {
    selections: SelectionType[];
    selected: string;
    placeholder?: string;
  }

  let {
    selected = $bindable(),
    selections,
    placeholder = 'Select something',
    ...restProps
  }: Props = $props();

  const triggerContent = $derived(
    selections.find((item) => item.name.toLocaleLowerCase() === selected.toLocaleLowerCase())
  );
</script>

<Select.Root type="single" name={placeholder} bind:value={selected}>
  <Select.Trigger>
    {triggerContent?.name || placeholder}
  </Select.Trigger>
  <Select.Content {...restProps}>
    <Select.Group>
      {#each selections as select}
        <Select.Item value={select.value} label={select.name} />
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>

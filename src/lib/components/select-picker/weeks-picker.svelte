<script lang="ts" module>
  interface Props {
    selectedDays: string[];
  }

  export const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
</script>

<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';

  let { selectedDays = $bindable() }: Props = $props();
</script>

<Select.Root type="multiple" bind:value={selectedDays}>
  <Select.Trigger>
    {selectedDays
      .map((day) => day.slice(0, 3))
      .join(', ')
      .toUpperCase() || 'Select Days'}
  </Select.Trigger>
  <Select.Content>
    {#each days as day}
      <Select.Item value={day}>{day}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>

<script lang="ts" module>
  import Clock9 from 'lucide-svelte/icons/clock-9';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import * as Select from '$lib/components/ui/select/index.js';

  interface Props {
    selectedTime: {
      hour: string;
      minute: string;
      second: string;
      ampm: string;
    };
  }

  const timeStruct = {
    hours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    seconds: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    ampm: ['AM', 'PM']
  } as const;

  export const convertSelectedTime = (
    hour: string,
    minute: string,
    second: string,
    ampm: string
  ) => {
    // Convert 12-hour format to 24-hour format
    if (ampm === 'PM' && hour !== '12') {
      hour = (parseInt(hour) + 12).toString();
    } else if (ampm === 'AM' && hour === '12') {
      hour = '00';
    }

    // Create Date object with current date and selected time
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute), parseInt(second), 0);

    return date.getTime(); // Return UNIX timestamp in milliseconds
  };

  export const timestampToSelectedTime = (timestamp: number) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // Convert 0 to 12 for 12-hour format

    return {
      hour: hours.toString().padStart(2, '0'),
      minute: minutes,
      second: seconds,
      ampm: ampm
    };
  };
</script>

<script lang="ts">
  let {
    selectedTime = $bindable({
      hour: '',
      minute: '00',
      second: '00',
      ampm: 'AM'
    })
  }: Props = $props();
</script>

<Popover.Root>
  <Popover.Trigger
    class="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-normal ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {#if selectedTime.hour && selectedTime.minute && selectedTime.second && selectedTime.ampm}
      {selectedTime.hour} : {selectedTime.minute} : {selectedTime.second} {selectedTime.ampm}
    {:else}
      <span class="text-muted-foreground">Select Time</span>
    {/if}
    <Clock9 class="size-4" />
  </Popover.Trigger>
  <Popover.Content class="w-fit">
    <div class="flex items-center gap-2">
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label>Hour</Label>
        <Select.Root type="single" bind:value={selectedTime.hour}>
          <Select.Trigger class="w-20">
            {selectedTime.hour || 'Hour'}
          </Select.Trigger>
          <Select.Content>
            {#each timeStruct.hours as hour}
              <Select.Item value={hour.toString()}>{hour}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label>Minute</Label>
        <Select.Root type="single" bind:value={selectedTime.minute}>
          <Select.Trigger class="w-20">
            {selectedTime.minute || 'Minute'}
          </Select.Trigger>
          <Select.Content>
            {#each timeStruct.minutes as minute}
              <Select.Item value={minute.toString()}>{minute}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label>Second</Label>
        <Select.Root type="single" bind:value={selectedTime.second}>
          <Select.Trigger class="w-20">
            {selectedTime.second || 'Second'}
          </Select.Trigger>
          <Select.Content>
            {#each timeStruct.seconds as second}
              <Select.Item value={second.toString()}>{second}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label>AM/PM</Label>
        <Select.Root type="single" bind:value={selectedTime.ampm}>
          <Select.Trigger class="w-20">
            {selectedTime.ampm || 'AM/PM'}
          </Select.Trigger>
          <Select.Content>
            {#each timeStruct.ampm as ampm}
              <Select.Item value={ampm.toString()}>{ampm}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

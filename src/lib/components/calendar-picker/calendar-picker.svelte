<script lang="ts">
  import { Calendar as CalendarPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
  import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
  import * as Calendar from '$lib/components/ui/calendar/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { cn } from '$lib/utils.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import CalendarFold from 'lucide-svelte/icons/calendar-fold';

  type Props = WithoutChildrenOrChild<CalendarPrimitive.RootProps> & {
    dateString: string;
    title?: string;
  };

  let {
    dateString = $bindable(),
    weekdayFormat = 'short',
    class: className,
    ...restProps
  }: Props = $props();

  const monthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ].map((month, i) => ({ value: i + 1, label: month }));

  let value = $state<DateValue | DateValue[] | undefined>();
  let placeholder = $state<DateValue | undefined>();

  const monthFmt = new DateFormatter('en-US', {
    month: 'long'
  });

  const yearOptions = Array.from({ length: 100 }, (_, i) => ({
    label: String(new Date().getFullYear() - i),
    value: new Date().getFullYear() - i
  }));

  const defaultYear = $derived(
    placeholder ? { value: placeholder.year, label: String(placeholder.year) } : undefined
  );

  const defaultMonth = $derived(
    placeholder
      ? {
          value: placeholder.month,
          label: monthFmt.format(placeholder.toDate(getLocalTimeZone()))
        }
      : undefined
  );

  const monthLabel = $derived(
    monthOptions.find((m) => m.value === defaultMonth?.value)?.label ?? 'Select a month'
  );

  let open = $state(false);
</script>

<Popover.Root bind:open>
  <Popover.Trigger
    class="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
  >
    <span class={dateString ? '' : 'text-muted-foreground'}
      >{dateString || (restProps.title ?? 'Select Date')}</span
    >
    <CalendarFold class="ml-auto size-4" />
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <CalendarPrimitive.Root
      bind:value={value as never}
      bind:placeholder
      {weekdayFormat}
      class={cn('rounded-md border p-3', className)}
      {...restProps}
    >
      {#snippet children({ months, weekdays })}
        <Calendar.Header>
          <Calendar.Heading class="flex w-full items-center justify-between gap-2">
            <Select.Root
              type="single"
              value={`${defaultMonth?.value}`}
              onValueChange={(v) => {
                if (!v || !placeholder) return;
                if (v === `${placeholder?.month}`) return;
                placeholder = placeholder.set({ month: Number.parseInt(v) });
              }}
            >
              <Select.Trigger aria-label="Select month" class="w-[60%]">
                {monthLabel}
              </Select.Trigger>
              <Select.Content class="max-h-[200px] overflow-y-auto">
                {#each monthOptions as { value, label }}
                  <Select.Item value={`${value}`} {label} />
                {/each}
              </Select.Content>
            </Select.Root>
            <Select.Root
              type="single"
              value={`${defaultYear?.value}`}
              onValueChange={(v) => {
                if (!v || !placeholder) return;
                if (v === `${placeholder?.year}`) return;
                placeholder = placeholder.set({ year: Number.parseInt(v) });
                dateString = String(placeholder);
              }}
            >
              <Select.Trigger aria-label="Select year" class="w-[40%]">
                {defaultYear?.label ?? 'Select year'}
              </Select.Trigger>
              <Select.Content class="max-h-[200px] overflow-y-auto">
                {#each yearOptions as { value, label }}
                  <Select.Item value={`${value}`} {label} />
                {/each}
              </Select.Content>
            </Select.Root>
          </Calendar.Heading>
        </Calendar.Header>
        <Calendar.Months>
          {#each months as month}
            <Calendar.Grid>
              <Calendar.GridHead>
                <Calendar.GridRow class="flex">
                  {#each weekdays as weekday}
                    <Calendar.HeadCell>
                      {weekday.slice(0, 2)}
                    </Calendar.HeadCell>
                  {/each}
                </Calendar.GridRow>
              </Calendar.GridHead>
              <Calendar.GridBody>
                {#each month.weeks as weekDates}
                  <Calendar.GridRow class="mt-2 w-full">
                    {#each weekDates as date}
                      <Calendar.Cell {date} month={month.value}>
                        <Calendar.Day
                          onclick={() => {
                            placeholder = date;
                            dateString = String(date);
                            open = false;
                          }}
                        />
                      </Calendar.Cell>
                    {/each}
                  </Calendar.GridRow>
                {/each}
              </Calendar.GridBody>
            </Calendar.Grid>
          {/each}
        </Calendar.Months>
      {/snippet}
    </CalendarPrimitive.Root>
  </Popover.Content>
</Popover.Root>

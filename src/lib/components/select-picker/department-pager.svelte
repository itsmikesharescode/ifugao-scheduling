<script lang="ts">
  import { goto } from '$app/navigation';

  import { page } from '$app/state';

  import * as Select from '$lib/components/ui/select/index.js';
  import { urlParamReducer, urlParamStacker } from '$lib/utils';

  let id = $state(page.url.searchParams.get('filter') ?? 'all');

  const triggerContent = $derived(page.data.departments?.find((item) => item.id === Number(id)));
</script>

<Select.Root
  onValueChange={(selected) => {
    if (selected === 'all') {
      goto(`${page.url.pathname}?${urlParamReducer('filter', page)}`);
    } else {
      goto(urlParamStacker('filter', selected.toLocaleLowerCase(), page));
    }
  }}
  type="single"
  bind:value={id}
>
  <Select.Trigger>
    {triggerContent?.name || 'All Departments'}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Item value="all" label="All Departments" />
      {#each page.data.departments ?? [] as department}
        <Select.Item value={department.id.toString()} label={department.name}>
          <div class="">
            <div class="flex items-center gap-2">
              <span style="background: {department.color}" class="size-5 rounded-full"></span>
              <span>{department.code}</span>
            </div>

            <span class="text-xs text-muted-foreground">{department.name}</span>
          </div>
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>

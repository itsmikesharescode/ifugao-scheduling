<script lang="ts" module>
  const departments = [
    {
      id: crypto.randomUUID(),
      name: 'All Departments',
      code: 'all'
    },
    {
      id: crypto.randomUUID(),
      name: 'Department 1',
      code: 'd1'
    },
    {
      id: crypto.randomUUID(),
      name: 'Department 2',
      code: 'd2'
    },
    {
      id: crypto.randomUUID(),
      name: 'Department 3',
      code: 'd3'
    },
    {
      id: crypto.randomUUID(),
      name: 'Department 4',
      code: 'd4'
    }
  ];
</script>

<script lang="ts">
  import { goto } from '$app/navigation';

  import { page } from '$app/state';

  import * as Select from '$lib/components/ui/select/index.js';
  import { urlParamReducer, urlParamStacker } from '$lib/utils';

  let code = $state('all');

  const triggerContent = $derived(
    departments.find((item) => item.code.toLocaleLowerCase() === code.toLocaleLowerCase())
  );
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
  bind:value={code}
>
  <Select.Trigger>
    {triggerContent?.name || 'Select Department'}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each departments as department}
        <Select.Item value={department.code} label={department.name} />
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>

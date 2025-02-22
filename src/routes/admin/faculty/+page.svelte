<script lang="ts" module>
  import DepartmentPager from '$lib/components/select-picker/department-pager.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import DataTable from '$lib/components/ui/data-table/data-table.svelte';
  import { columns } from './components/table/columns';

  const generateFacultyData = (count: number) => {
    const firstNames = ['Maria', 'Juan', 'Ana', 'Carlos', 'Liza', 'Ramon', 'Elena', 'Luis'];
    const lastNames = ['Santos', 'Cruz', 'Reyes', 'Bautista', 'Garcia', 'Aquino', 'Dela Cruz'];
    const ranks = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
    const departments = ['BIO', 'CHEM', 'PHYS', 'MATH', 'ENG', 'HIST'];
    const birthDate = new Date(
      Date.now() - Math.floor((25 + Math.random() * 40) * 365 * 24 * 60 * 60 * 1000)
    );
    return Array.from({ length: count }, (_, index) => {
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const yearBorn = 1950 + Math.floor(Math.random() * 50);

      return {
        id: index + 1,
        created_at: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Within last year
        firstname: firstNames[Math.floor(Math.random() * firstNames.length)],
        middlename: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastname: lastNames[Math.floor(Math.random() * lastNames.length)],
        gender,
        academic_rank: ranks[Math.floor(Math.random() * ranks.length)],
        departments: [Math.floor(Math.random() * 100) + 1],
        department_code: departments[Math.floor(Math.random() * departments.length)],
        status: Math.random() > 0.2 ? 'Active' : 'Inactive',
        birth_date: birthDate.toISOString().split('T')[0]
      };
    });
  };
</script>

<script lang="ts">
  import { urlParamStacker } from '$lib/utils';
  import { page } from '$app/state';
  import CreateFaculty from './components/forms/create-faculty/create-faculty.svelte';
  import { initTableState } from './components/table/state.svelte';
  import UpdateFaculty from './components/forms/update-faculty/update-faculty.svelte';
  import DeleteFaculty from './components/forms/delete-faculty/delete-faculty.svelte';

  initTableState();
  const { data } = $props();
</script>

<main class="flex flex-col gap-4">
  <section class="flex items-center justify-between">
    <div class="grid grid-cols-[auto_1fr] items-center gap-2">
      <Label>Filter by Department:</Label>
      <DepartmentPager />
    </div>

    <Button size="sm" href={urlParamStacker('mode', 'create', page)}>
      Create Faculty
      <Plus />
    </Button>
  </section>
  <DataTable data={data.faculties ?? []} {columns} />
</main>

<CreateFaculty createFacForm={data.createFacForm} />
<UpdateFaculty updateFacForm={data.updateFacForm} />
<DeleteFaculty deleteFacForm={data.deleteFacForm} />

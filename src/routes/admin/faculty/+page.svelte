<script lang="ts" module>
  const generateFacultyData = (count: number) => {
    const firstNames = ['Maria', 'Juan', 'Ana', 'Carlos', 'Liza', 'Ramon', 'Elena', 'Luis'];
    const lastNames = ['Santos', 'Cruz', 'Reyes', 'Bautista', 'Garcia', 'Aquino', 'Dela Cruz'];
    const ranks = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
    const departments = ['BIO', 'CHEM', 'PHYS', 'MATH', 'ENG', 'HIST'];

    return Array.from({ length: count }, (_, index) => {
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const yearBorn = 1950 + Math.floor(Math.random() * 50);

      return {
        id: index + 1,
        created_at: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Within last year
        firstname: firstNames[Math.floor(Math.random() * firstNames.length)],
        middlename:
          Math.random() > 0.7 ? firstNames[Math.floor(Math.random() * firstNames.length)] : '',
        lastname: lastNames[Math.floor(Math.random() * lastNames.length)],
        gender,
        academic_rank: ranks[Math.floor(Math.random() * ranks.length)],
        department_id: Math.floor(Math.random() * 100) + 1,
        department_code: departments[Math.floor(Math.random() * departments.length)],
        status: Math.random() > 0.2 ? 'Active' : 'Inactive',
        birth_date: new Date(
          yearBorn,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toISOString()
      };
    });
  };

  console.log(generateFacultyData(10));
</script>

<script lang="ts">
</script>

<main></main>

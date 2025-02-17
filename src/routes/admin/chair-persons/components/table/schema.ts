import { z } from 'zod';
//note: we only need department_name for displaying to avoid extra db calls via department_id
export const accountsPageSchema = z.object({
  user_id: z.string(),
  avatar: z.string(),
  email: z.string(),
  firstname: z.string(),
  middlename: z.string(),
  lastname: z.string(),
  academic_rank: z.string(),
  departments: z.array(z.number()),
  department_name: z.string(),
  status: z.string(),
  gender: z.string(),
  birth_date: z.string(),
  operational: z.string()
});

export type AccountsPageSchema = z.output<typeof accountsPageSchema>;

import { z } from 'zod';

export const accountsPageSchema = z.object({
  user_id: z.string(),
  avatar: z.string(),
  email: z.string(),
  firstname: z.string(),
  middlename: z.string(),
  lastname: z.string(),
  academic_rank: z.string(),
  department_id: z.number(),
  department_name: z.string(),
  status: z.string(),
  gender: z.string(),
  birth_date: z.string(),
  operational: z.string()
});

export type AccountsPageSchema = z.output<typeof accountsPageSchema>;

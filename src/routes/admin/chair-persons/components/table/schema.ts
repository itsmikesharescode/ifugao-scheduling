import { z } from 'zod';
//note: we only need department_name for displaying to avoid extra db calls via department_id

export const accountsPageSchema = z.object({
  created_at: z.string(),
  user_id: z.string(),
  avatar_path: z.string().nullable(),
  email: z.string(),
  gender: z.string(),
  status: z.string(),
  role_id: z.string(),
  lastname: z.string(),
  firstname: z.string(),
  birth_date: z.string(),
  middlename: z.string(),
  departments: z.array(z.number()),
  academic_rank: z.string()
});

export type AccountsPageSchema = z.output<typeof accountsPageSchema>;

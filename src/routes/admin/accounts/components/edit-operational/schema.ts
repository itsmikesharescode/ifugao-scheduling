import { z } from 'zod';

export const editOperationalSchema = z.object({
  user_id: z.string(),
  operational: z.string().min(1, 'Must select status.')
});

export type EditOperationalSchema = typeof editOperationalSchema;

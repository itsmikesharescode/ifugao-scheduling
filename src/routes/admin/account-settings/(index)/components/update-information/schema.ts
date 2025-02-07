import { z } from 'zod';

export const updateInfoSchema = z.object({
  firstname: z.string().min(1, 'Must enter new first name.'),
  middlename: z.string().min(1, 'Must enter new middle name.'),
  lastname: z.string().min(1, 'Must enter new last name.'),
  address: z.string().min(1, 'Must enter new address.')
});

export type UpdateInfoSchema = typeof updateInfoSchema;

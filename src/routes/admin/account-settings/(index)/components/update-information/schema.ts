import { z } from 'zod';

export const updateInfoSchema = z.object({
  firstname: z.string().min(1, 'Must enter new first name.'),
  middlename: z.string().min(1, 'Must enter new middle name.'),
  lastname: z.string().min(1, 'Must enter new last name.'),
  birth_date: z.string().min(1, 'Must enter new birthdate.'),
  gender: z.string().min(1, 'Must enter new gender.')
});

export type UpdateInfoSchema = typeof updateInfoSchema;

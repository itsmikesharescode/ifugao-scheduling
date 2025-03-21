import { z } from 'zod';

const baseSchema = {
  first_name: z.string().min(1, 'Must enter first name.'),
  middle_name: z.string().min(1, 'Must enter middle name.'),
  last_name: z.string().min(1, 'Must enter last name.'),
  gender: z.string().min(1, 'Must select gender.'),
  academic_rank: z.string(),
  status: z.string(),
  birth_date: z.string(),
  departments: z.array(z.number()).min(1, 'Must select at least one department.')
};

export const createFacSchema = z.object(baseSchema);

export const updateFacSchema = z.object(baseSchema).extend({
  id: z.number()
});

export const deleteFacSchema = z.object({
  id: z.number()
});

export type CreateFacSchema = typeof createFacSchema;
export type UpdateFacSchema = typeof updateFacSchema;
export type DeleteFacSchema = typeof deleteFacSchema;

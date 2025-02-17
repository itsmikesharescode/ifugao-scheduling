import { z } from 'zod';

const commonFields = {
  name: z.string().min(1, 'Must enter course name.'),
  departments: z.array(z.number()).min(1, 'Must select at least one department.')
};

export const createSectionSchema = z.object(commonFields);

export const editSectionSchema = z.object(commonFields).extend({
  id: z.number()
});

export const deleteSectionSchema = z.object({
  id: z.number()
});

export type CreateSectionSchema = typeof createSectionSchema;
export type EditSectionSchema = typeof editSectionSchema;
export type DeleteSectionSchema = typeof deleteSectionSchema;

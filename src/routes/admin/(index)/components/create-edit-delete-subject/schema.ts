import { z } from 'zod';

const commonFields = {
  course_code: z.string().min(1, 'Must enter course code.'),
  name: z.string().min(1, 'Must enter course name.'),
  departments: z.array(z.number()).min(1, 'Must select at least one department.')
};

export const createSubjectSchema = z.object(commonFields);

export const editSubjectSchema = z.object(commonFields).extend({
  id: z.number()
});

export const deleteSubjectSchema = z.object({
  id: z.number()
});

export type CreateSubjectSchema = typeof createSubjectSchema;
export type EditSubjectSchema = typeof editSubjectSchema;
export type DeleteSubjectSchema = typeof deleteSubjectSchema;

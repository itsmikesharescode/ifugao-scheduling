import { z } from 'zod';

const loadProfSchema = z.object({
  code: z.string().min(1, 'Subject code is required'),
  section_id: z.number().min(1, 'Section is required'),
  subject_id: z.number().min(1, 'Subject selection is required'),
  units: z.number().min(0.5, 'Units must be at least 0.5'),
  num_of_hours: z
    .object({
      lecture: z.number().min(0, 'Lecture hours cannot be negative'),
      lab: z.number().min(0, 'Lab hours cannot be negative')
    })
    .refine((data) => data.lecture + data.lab > 0, {
      message: 'Total hours must be greater than 0'
    })
});

export const editScheduleSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  semester: z.string().min(1, 'Please select a semester'),
  school_year: z.string().min(1, 'Please select a school year'),
  department_id: z.number().min(0, 'Department cannot be negative'),
  dynamic_form: z
    .array(loadProfSchema)
    .min(1, 'At least one subject entry is required')
    .refine((items) => new Set(items.map((i) => i.code)).size === items.length, {
      message: 'Duplicate subject codes found'
    })
});

export type EditScheduleSchema = typeof editScheduleSchema;

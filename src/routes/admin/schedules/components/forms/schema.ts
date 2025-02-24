import { z } from 'zod';

//NOTE: must populate by accounts details faculty_name, academic_rank, status, campus, department

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

const baseSchema = {
  user_id: z.string(),
  semester: z.string().min(1, 'Please select a semester'),
  school_year: z.string().min(1, 'Please select a school year'),
  department_id: z.number().min(1, 'Department selection is required'),
  schedule: z.object({
    days: z.array(z.string()).min(1, 'At least one day is required'),
    start_time: z.number().min(1, 'Start time is required'),
    end_time: z.number().min(1, 'End time is required')
  }),
  dynamic_form: z
    .array(loadProfSchema)
    .min(1, 'At least one subject entry is required')
    .refine((items) => new Set(items.map((i) => i.code)).size === items.length, {
      message: 'Duplicate subject codes found'
    })
};

export const createSchedSchema = z.object(baseSchema);

export const updateSchedSchema = createSchedSchema.extend({
  id: z.number()
});

export const deleteSchedSchema = z.object({
  id: z.number()
});

export type CreateSchedSchema = typeof createSchedSchema;
export type UpdateSchedSchema = typeof updateSchedSchema;
export type DeleteSchedSchema = typeof deleteSchedSchema;

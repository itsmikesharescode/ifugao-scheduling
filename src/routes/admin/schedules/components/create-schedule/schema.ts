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
    }),
  schedule: z.string().min(1, 'Please select a schedule batch')
});

export const createScheduleSchema = z.object({
  semester: z.string().min(1, 'Please select a semester'),
  school_year: z.string().min(1, 'Please select a school year'),
  dynamic_form: z
    .array(loadProfSchema)
    .min(1, 'At least one subject entry is required')
    .refine((items) => new Set(items.map((i) => i.code)).size === items.length, {
      message: 'Duplicate subject codes found'
    })
});

export type CreateScheduleSchema = typeof createScheduleSchema;

import { z } from 'zod';

const loadProfSchema = z.object({
  code: z.string(),
  section_id: z.number(),
  subject_id: z.number(),
  units: z.number(),
  num_of_hours: z.object({
    lecture: z.number(),
    lab: z.number()
  })
});

export const schedulePageSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  user_id: z.string(),
  user_fullname: z.string(),
  department_id: z.number(),
  department_name: z.string(),
  semester: z.string(),
  school_year: z.string(),
  dynamic_form: z.array(loadProfSchema)
});

export type SchedulePageSchema = z.output<typeof schedulePageSchema>;

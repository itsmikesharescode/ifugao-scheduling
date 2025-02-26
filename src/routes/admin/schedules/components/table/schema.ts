import { z } from 'zod';
import type { DynamicForm } from '$lib/types';

export const schedulePageSchema = z.object({
  id: z.number(),
  faculty_id: z.number(),
  created_at: z.string(),
  days: z.array(z.string()),
  department_id: z.number(),
  dynamic_form: z.array(z.custom<DynamicForm>()),
  end_time: z.string(),
  start_time: z.string(),
  school_year: z.string(),
  semester: z.string()
});

export type SchedulePageSchema = z.output<typeof schedulePageSchema>;

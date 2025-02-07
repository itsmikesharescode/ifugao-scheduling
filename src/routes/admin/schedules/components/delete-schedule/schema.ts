import { z } from 'zod';

export const deleteScheduleSchema = z.object({
  id: z.number()
});

export type DeleteScheduleSchema = typeof deleteScheduleSchema;

import { z } from 'zod';

export const deleteAccountSchema = z.object({
  user_id: z.string(),
  avatar: z.string()
});

export type DeleteAccountSchema = typeof deleteAccountSchema;

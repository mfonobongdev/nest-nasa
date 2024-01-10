import { z } from 'zod';

export const addNewLaunchDto = z.object({
  mission: z.string().min(1),
  rocket: z.string().min(1),
  destination: z.string().min(1),
  launchDate: z.coerce.date(),
});

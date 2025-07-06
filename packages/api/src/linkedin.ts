import { z } from 'zod';

export const linkedinEmbedCode = z.object({
  originCode: z.string(),
  src: z.string(),
  width: z.number(),
  height: z.number(),
});

export type LinkedinEmbedCode = z.infer<typeof linkedinEmbedCode>;

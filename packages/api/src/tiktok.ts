import {z} from 'zod';

export const tiktokOembedResponseSchema = z.object({
  version: z.string(),
  type: z.string(),
  title: z.string(),
  author_url: z.string(),
  author_name: z.string(),
  width: z.string(),
  height: z.string(),
  html: z.string(),
  thumbnail_width: z.number(),
  thumbnail_height: z.number(),
  thumbnail_url: z.string(),
  provider_url: z.string(),
  provider_name: z.string(),
  author_unique_id: z.string(),
  embed_product_id: z.string(),
  embed_type: z.string(),
  url: z.string().url(),
})

export type TiktokOembedResponse = z.infer<typeof tiktokOembedResponseSchema>;


export const tiktokOembedRequestShema = z.object({
  url: z.string().url()
})
export type TiktokOembedRequest = z.infer<typeof tiktokOembedRequestShema>;

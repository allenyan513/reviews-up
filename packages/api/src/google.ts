import { z } from 'zod';

export const googleMapRequestSchema = z.object({
  textQuery: z.string().min(1, 'Text query is required'),
});

export type GoogleMapRequest = z.infer<typeof googleMapRequestSchema>;

export const googleMapResponseSchema = z.object({
  places: z.lazy(() => z.array(googlePlace)),
});
export type GoogleMapResponse = z.infer<typeof googleMapResponseSchema>;

export const googlePlace = z.object({
  id: z.string().min(1, 'Place ID is required'),
  formattedAddress: z.string().min(1, 'Address ID is required'),
  rating: z.number().optional(),
  userRatingCount: z.number().optional(),
  reviews: z.lazy(() => z.array(googlePlaceReview)).optional(),
  websiteUri: z.string().optional(),
  googleMapsUri: z.string().url().optional(),
  displayName: z.object({
    text: z.string().optional(),
    languageCode: z.string().optional(),
  }).optional(),
});
export type GooglePlace = z.infer<typeof googlePlace>;
export const googlePlaceReview = z.object({
  name: z.string().min(1, 'Reviewer name is required'),
  relativePublishTimeDescription: z
    .string()
    .min(1, 'Relative publish time description is required'),
  rating: z.number().optional(),
  text: z.object({
    text: z.string().optional(),
    languageCode: z.string().optional(),
  })
    .nullable()
    .optional(),
  originalText: z
    .object({
      text: z.string().optional(),
      languageCode: z.string().optional(),
    })
    .nullable()
    .optional(),
  authorAttribution: z
    .object({
      displayName: z.string().optional(),
      uri: z.string().url().optional(),
      photoUri: z.string().url().optional(),
    })
    .nullable()
    .optional(),
  publishTime: z
    .object({
      seconds: z.string().optional(),
      nanos: z.number().optional(),
    })
    .nullable()
    .optional(),
  googleMapsUri: z.string().url().optional(),
});
export type GooglePlaceReview = z.infer<typeof googlePlaceReview>;

import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewMediaDto } from './create-review-media.dto';

export class UpdateReviewMediaDto extends PartialType(CreateReviewMediaDto) {}

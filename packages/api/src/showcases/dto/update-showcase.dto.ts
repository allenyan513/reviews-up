import { PartialType } from '@nestjs/mapped-types';
import { CreateShowcaseDto } from './create-showcase.dto';

export class UpdateShowcaseDto extends PartialType(CreateShowcaseDto) {}

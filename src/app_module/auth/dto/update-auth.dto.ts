import { PartialType } from '@nestjs/swagger';
import { LineUid } from './line-uid.dto';

export class UpdateAuthDto extends PartialType(LineUid) {}

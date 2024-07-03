import { PartialType } from '@nestjs/swagger';
import { CreateBindYourFortuneDto } from './create-bind-your-fortune.dto';

export class UpdateBindYourFortuneDto extends PartialType(CreateBindYourFortuneDto) {}

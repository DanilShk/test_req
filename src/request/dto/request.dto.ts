import { IsString, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  text: string;
}

export class ChangeStatusEvent {
  @IsUUID()
  id: string;
}

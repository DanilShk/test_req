import { IsString, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  text: string;
}

export class ChangeStatusEventDto {
  constructor(id: string) {
    this.id = id;
  }

  @IsUUID()
  id: string;
}

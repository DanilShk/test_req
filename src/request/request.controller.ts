import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { Request } from '@prisma/client';
import { ChangeStatusEvent, CreateRequestDto } from './dto/request.dto';
import { RequestService } from './request.service';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto): Promise<Request> {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  findAll(): Promise<Request[]> {
    return this.requestService.findAll();
  }

  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new RpcException(errors),
    }),
  )
  @EventPattern('change_status')
  async handleChangeStatus(@Payload() data: ChangeStatusEvent) {
    await this.requestService.changeStatusEvent(data);
  }
}

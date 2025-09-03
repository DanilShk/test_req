import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Request } from '@prisma/client';
import { ChangeStatusEventDto, CreateRequestDto } from './dto/request.dto';
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

  @EventPattern('change_status')
  async handleChangeStatus(@Payload() data: ChangeStatusEventDto) {
    await this.requestService.changeStatusEvent(data);
  }
}

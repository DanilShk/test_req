import { Body, Controller, Get, Post } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
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
  async handleChangeStatus(
    @Payload() data: ChangeStatusEventDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.requestService.changeStatusEvent(data);

    channel.ack(originalMsg);
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Status } from '@prisma/client';
import { PrismaService } from 'infrastructure/prisma/prisma.service';
import { REQUEST_SERVISE } from 'src/common/constants/token.const';
import delay from 'src/common/helpers/delay';
import { nextStatus } from './common/next-status';
import { ChangeStatusEventDto, CreateRequestDto } from './dto/request.dto';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(PrismaService.name, { timestamp: true });
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST_SERVISE) private client: ClientProxy,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<Request> {
    const request = await this.prisma.request.create({
      data: { text: createRequestDto.text },
    });

    if (!request) {
      throw new BadRequestException('the request not created');
    }

    this.client.emit('change_status', new ChangeStatusEventDto(request.id));

    return request;
  }

  findAll(): Promise<Request[]> {
    return this.prisma.request.findMany();
  }

  async changeStatusEvent(data: ChangeStatusEventDto) {
    this.logger.log('changeStatusEvent started', data);

    await delay(5000);

    const { id } = data;

    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('request not found');
    }

    const next = nextStatus[request.status];

    if (!next || next === request.status) {
      this.logger.log('request already in final state', request.status);
      return;
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: { status: next },
    });

    this.client.emit('change_status', { id, status: Status.DONE });

    this.logger.log('changeStatusEvent finished', updatedRequest);
  }
}

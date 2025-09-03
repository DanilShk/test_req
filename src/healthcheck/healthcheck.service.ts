import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  status(): { status: string } {
    return { status: 'OK' };
  }
}

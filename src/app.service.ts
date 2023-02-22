import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'It would be great to have a welcome drink here';
  }
}

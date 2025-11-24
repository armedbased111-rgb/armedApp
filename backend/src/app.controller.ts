import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { timestamp } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
getHello() {
  return { message: this.appService.getHello() };
}
  @Get('api/test')
  getTest() {
    return { message: 'API fonctionne!', timestamp: new Date().toISOString() };
  }
}

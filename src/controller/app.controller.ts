import { Controller } from '@nestjs/common';
import { AppService } from 'src/service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}

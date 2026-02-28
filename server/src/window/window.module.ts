import { Module } from '@nestjs/common';
import { WindowService } from './window.service.js';
import { WindowController } from './window.controller.js';

@Module({
  controllers: [WindowController],
  providers: [WindowService],
})
export class WindowModule {}

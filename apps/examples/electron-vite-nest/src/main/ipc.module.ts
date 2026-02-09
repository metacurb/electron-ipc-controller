import { Module } from '@nestjs/common'

import { CounterController } from './controllers/counter.controller'

@Module({
  providers: [CounterController]
})
export class IpcModule {}

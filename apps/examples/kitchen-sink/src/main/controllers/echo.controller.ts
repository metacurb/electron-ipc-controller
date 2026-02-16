import {
  Channel,
  IpcController,
  IpcHandle,
  IpcHandleOnce,
  IpcOn,
  IpcOnce
} from '@electron-ipc-bridge/core'

import type { LoggerService } from '../services/logger.service'

import type { ComplexPayload, SimplePayload } from './types'

@IpcController('echo')
export class EchoController {
  constructor(private readonly logger: LoggerService) {}

  @IpcHandle()
  complex(@Channel() channel: string, input: ComplexPayload): ComplexPayload {
    this.logger.log(channel, { input })
    return input
  }

  @IpcOn()
  fireAndForget(@Channel() channel: string, msg: string): void {
    this.logger.log(channel, { msg })
  }

  @IpcHandleOnce()
  onceInvoke(@Channel() channel: string, msg: string): string {
    this.logger.log(channel, { msg })
    return `once: ${msg}`
  }

  @IpcOnce()
  onceListen(@Channel() channel: string): void {
    this.logger.log(channel, { message: "This won't fire again" })
  }

  @IpcHandle()
  simple(@Channel() channel: string, input: SimplePayload): SimplePayload {
    this.logger.log(channel, { input })
    return input
  }
}

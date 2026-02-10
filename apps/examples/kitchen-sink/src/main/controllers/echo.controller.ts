import {
  IpcController,
  IpcHandle,
  IpcHandleOnce,
  IpcOn,
  IpcOnce
} from '@electron-ipc-controller/core'

import type { LoggerService } from '../services/logger.service'

import type { ComplexPayload, SimplePayload } from './types'

@IpcController('echo')
export class EchoController {
  constructor(private readonly logger: LoggerService) {}

  @IpcHandle()
  complex(input: ComplexPayload): ComplexPayload {
    this.logger.log('echo.complex', { input })
    return input
  }

  @IpcOn()
  fireAndForget(msg: string): void {
    this.logger.log('echo.fireAndForget', { msg })
  }

  @IpcHandleOnce()
  onceInvoke(msg: string): string {
    this.logger.log('echo.onceInvoke', { msg })
    return `once: ${msg}`
  }

  @IpcOnce()
  onceListen(): void {
    this.logger.log('echo.onceListen', { message: "This won't fire again" })
  }

  @IpcHandle()
  simple(input: SimplePayload): SimplePayload {
    this.logger.log('echo.simple', { input })
    return input
  }
}

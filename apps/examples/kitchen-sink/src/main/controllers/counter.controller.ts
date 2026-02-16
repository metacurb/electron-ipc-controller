import {
  Channel,
  CorrelationId,
  IpcController,
  IpcHandle,
  IpcOn,
  ProcessId,
  Sender,
  Window
} from '@electron-ipc-bridge/core'
import type { BrowserWindow, WebContents } from 'electron/main'

import type { LoggerService } from '../services/logger.service'

@IpcController('counter')
export class CounterController {
  private value = 0

  constructor(private readonly logger: LoggerService) {}

  @IpcHandle()
  get(@Channel() channel: string): number {
    this.logger.log(channel)
    return this.value
  }

  @IpcHandle('inc')
  increment(@Channel() channel: string, @Sender() sender: WebContents, by: number = 1): number {
    this.logger.log(channel, { by, senderId: sender.id })
    this.value += by
    return this.value
  }

  @IpcHandle()
  ping(
    @Channel() channel: string,
    @ProcessId() processId: number,
    @Window() window: BrowserWindow
  ): string {
    this.logger.log(channel, { processId, windowId: window.id })
    return 'pong'
  }

  @IpcOn()
  reset(@Channel() channel: string, @CorrelationId() correlationId: string): void {
    this.logger.log(channel, { correlationId })
    this.value = 0
  }
}

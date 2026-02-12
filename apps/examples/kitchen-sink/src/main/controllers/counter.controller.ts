import {
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
  get(): number {
    this.logger.log('counter.get')
    return this.value
  }

  @IpcHandle('inc')
  increment(@Sender() sender: WebContents, by: number = 1): number {
    this.logger.log('counter.increment', { by, senderId: sender.id })
    this.value += by
    return this.value
  }

  @IpcHandle()
  ping(@ProcessId() processId: number, @Window() window: BrowserWindow): string {
    this.logger.log('counter.ping', { processId, windowId: window.id })
    return 'pong'
  }

  @IpcOn()
  reset(@CorrelationId() correlationId: string): void {
    this.logger.log('counter.reset', { correlationId })
    this.value = 0
  }
}

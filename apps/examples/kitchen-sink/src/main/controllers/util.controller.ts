import { Channel, IpcController, IpcHandle, Origin, RawEvent } from '@electron-ipc-bridge/core'
import type { IpcMainInvokeEvent, WebFrameMain } from 'electron/main'

import type { LoggerService } from '../services/logger.service'

@IpcController('util')
export class UtilController {
  constructor(private readonly logger: LoggerService) {}

  @IpcHandle()
  withOrigin(
    @Channel() channel: string,
    @Origin() frame: WebFrameMain | undefined
  ): { hasFrame: boolean } {
    this.logger.log(channel, { hasFrame: frame != null })
    return { hasFrame: frame != null }
  }

  @IpcHandle()
  withRawEvent(
    @Channel() channel: string,
    @RawEvent() event: IpcMainInvokeEvent
  ): { eventType: string } {
    this.logger.log(channel, { eventType: event.type })
    return { eventType: event.type }
  }
}

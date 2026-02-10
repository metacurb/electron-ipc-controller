import { IpcController, IpcHandle, Origin, RawEvent } from '@electron-ipc-controller/core'
import type { IpcMainInvokeEvent, WebFrameMain } from 'electron/main'

import type { LoggerService } from '../services/logger.service'

@IpcController('util')
export class UtilController {
  constructor(private readonly logger: LoggerService) {}

  @IpcHandle()
  withOrigin(@Origin() frame: WebFrameMain | undefined): { hasFrame: boolean } {
    this.logger.log('util.withOrigin', { hasFrame: frame != null })
    return { hasFrame: frame != null }
  }

  @IpcHandle()
  withRawEvent(@RawEvent() event: IpcMainInvokeEvent): { eventType: string } {
    this.logger.log('util.withRawEvent', { eventType: event.type })
    return { eventType: event.type }
  }
}

import { getCorrelationId } from '@electron-ipc-bridge/core'

export class LoggerService {
  log(event: string, payload?: Record<string, unknown>): void {
    const correlationId = getCorrelationId()
    const prefix = correlationId != null ? `[${correlationId}]` : '[no-correlation]'
    if (payload != null) {
      console.log(prefix, event, payload)
    } else {
      console.log(prefix, event)
    }
  }
}

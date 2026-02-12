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
import { Service } from 'typedi'

type ComplexInput = {
  key: string
  key2: NestedInput
}

type NestedInput = {
  key: boolean
  key2: TestingEnum
}

enum TestingEnum {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three'
}

@Service()
@IpcController()
export class CounterController {
  private counter = 0

  @IpcHandle()
  complexExample(input: ComplexInput): ComplexInput {
    return input
  }

  @IpcHandle('get')
  getCounter(@CorrelationId() correlationId: string): number {
    console.log({ correlationId }, '[CounterController] Getting counter')
    return this.counter
  }

  @IpcHandle('inc')
  increment(
    @CorrelationId() correlationId: string,
    @Sender() sender: WebContents,
    incrementBy: number = 1
  ): number {
    console.log(
      { correlationId, incrementBy, senderId: sender.id },
      '[CounterController] Incrementing counter'
    )
    this.counter += incrementBy
    return this.counter
  }

  @IpcHandle()
  ping(@ProcessId() processId: number, @Window() window: BrowserWindow): string {
    console.log({ processId, windowId: window.id }, '[CounterController] Received ping')
    return 'pong'
  }

  @IpcOn()
  reset(@CorrelationId() correlationId: string): void {
    this.counter = 0
    console.log({ correlationId }, '[CounterController] Counter reset to 0')
  }
}

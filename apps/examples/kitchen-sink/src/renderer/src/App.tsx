import { useState } from 'react'

import { ComplexPayload, PayloadKind } from './ipc.types'

type SectionState = { status: string; error?: boolean }

export function App(): React.JSX.Element {
  const [counterStatus, setCounterStatus] = useState<SectionState>({ status: '' })
  const [echoStatus, setEchoStatus] = useState<SectionState>({ status: '' })
  const [utilStatus, setUtilStatus] = useState<SectionState>({ status: '' })

  const setStatus = (
    setter: React.Dispatch<React.SetStateAction<SectionState>>,
    msg: string,
    error = false
  ): void => setter({ error, status: msg })

  const handleCounterGet = async (): Promise<void> => {
    try {
      const n = await window.custom.counter.get()
      setStatus(setCounterStatus, `get → ${n}`)
    } catch (e) {
      setStatus(setCounterStatus, String(e), true)
    }
  }

  const handleCounterInc = async (): Promise<void> => {
    try {
      const n = await window.custom.counter.inc(2)
      setStatus(setCounterStatus, `inc(2) → ${n}`)
    } catch (e) {
      setStatus(setCounterStatus, String(e), true)
    }
  }

  const handleCounterPing = async (): Promise<void> => {
    try {
      const pong = await window.custom.counter.ping()
      setStatus(setCounterStatus, `ping → ${pong}`)
    } catch (e) {
      setStatus(setCounterStatus, String(e), true)
    }
  }

  const handleEchoComplex = async (): Promise<void> => {
    try {
      const input: ComplexPayload = {
        count: 1,
        id: 'x',
        nested: { flag: true, kind: PayloadKind.A },
        tags: ['a', 'b'],
        union: 42
      }
      const out = await window.custom.echo.complex(input)
      setStatus(setEchoStatus, JSON.stringify(out, null, 2))
    } catch (e) {
      setStatus(setEchoStatus, String(e), true)
    }
  }

  const handleEchoSimple = async (): Promise<void> => {
    try {
      const out = await window.custom.echo.simple({ message: 'hello' })
      setStatus(setEchoStatus, JSON.stringify(out))
    } catch (e) {
      setStatus(setEchoStatus, String(e), true)
    }
  }

  const handleEchoOnceInvoke = async (): Promise<void> => {
    try {
      const out = await window.custom.echo.onceInvoke('test')
      setStatus(setEchoStatus, out)
    } catch (e) {
      setStatus(setEchoStatus, String(e), true)
    }
  }

  const handleUtilWithOrigin = async (): Promise<void> => {
    try {
      const out = await window.custom.util.withOrigin()
      setStatus(setUtilStatus, JSON.stringify(out))
    } catch (e) {
      setStatus(setUtilStatus, String(e), true)
    }
  }

  const handleUtilWithRawEvent = async (): Promise<void> => {
    try {
      const out = await window.custom.util.withRawEvent()
      setStatus(setUtilStatus, JSON.stringify(out))
    } catch (e) {
      setStatus(setUtilStatus, String(e), true)
    }
  }

  return (
    <>
      <h1 className="sink-title">Kitchen Sink</h1>

      <section className="section">
        <h2>Counter (IpcHandle, IpcOn, CorrelationId, Sender, Window, ProcessId)</h2>
        <div className="section-actions">
          <button
            onClick={() => {
              void handleCounterGet()
            }}
          >
            get
          </button>
          <button
            onClick={() => {
              void handleCounterInc()
            }}
          >
            inc(2)
          </button>
          <button
            onClick={() => {
              void handleCounterPing()
            }}
          >
            ping
          </button>
          <button
            className="secondary"
            onClick={() => {
              window.custom.counter.reset()
              setStatus(setCounterStatus, 'reset() called')
            }}
          >
            reset
          </button>
        </div>
        <div className={`status ${counterStatus.error ? 'error' : ''}`}>
          {counterStatus.status || '-'}
        </div>
      </section>

      <section className="section">
        <h2>Echo (IpcHandle, IpcHandleOnce, IpcOn, IpcOnce - complex/simple types)</h2>
        <div className="section-actions">
          <button
            onClick={() => {
              void handleEchoComplex()
            }}
          >
            complex
          </button>
          <button
            onClick={() => {
              void handleEchoSimple()
            }}
          >
            simple
          </button>
          <button
            onClick={() => {
              void handleEchoOnceInvoke()
            }}
          >
            onceInvoke
          </button>
          <button
            className="secondary"
            onClick={() => {
              window.custom.echo.fireAndForget('fire')
              setStatus(setEchoStatus, 'fireAndForget sent')
            }}
          >
            fireAndForget
          </button>
          <button
            className="secondary"
            onClick={() => {
              window.custom.echo.onceListen()
              setStatus(setEchoStatus, 'onceListen sent')
            }}
          >
            onceListen
          </button>
        </div>
        <div className={`status pre ${echoStatus.error ? 'error' : ''}`}>
          {echoStatus.status || '-'}
        </div>
      </section>

      <section className="section">
        <h2>Util (Origin, RawEvent)</h2>
        <div className="section-actions">
          <button
            onClick={() => {
              void handleUtilWithOrigin()
            }}
          >
            withOrigin
          </button>
          <button
            onClick={() => {
              void handleUtilWithRawEvent()
            }}
          >
            withRawEvent
          </button>
        </div>
        <div className={`status ${utilStatus.error ? 'error' : ''}`}>
          {utilStatus.status || '-'}
        </div>
      </section>
    </>
  )
}

export default App

import { useEffect, useState } from 'react'

export function Counter(): React.JSX.Element {
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState('Connecting...')
  const [loading, setLoading] = useState(true)
  const [incrementBy, setIncrementBy] = useState(1)

  useEffect(() => {
    async function init(): Promise<void> {
      try {
        // Test connection with typed ping
        const pong = await window.ipc.counter.ping()
        setStatus(`Connected! ping → ${pong}`)

        // Get initial counter value
        const currentCount = await window.ipc.counter.get()
        setCount(currentCount)
        setLoading(false)
      } catch (err) {
        setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown'}`)
        setLoading(false)
      }
    }
    void init()
  }, [])

  const handleIncrement = async (): Promise<void> => {
    try {
      const newCount = await window.ipc.counter.inc(incrementBy)
      setCount(newCount)
      setStatus(`Incremented by ${incrementBy} to ${newCount}`)
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  const handleReset = (): void => {
    window.ipc.counter.reset()
    setCount(0)
    setStatus('Counter reset')
  }

  return (
    <div className="counter-card">
      <h2>Counter Demo</h2>
      <div className="counter-value">{loading ? '...' : count}</div>

      <div className="increment-options">
        <label htmlFor="increment-by">Increment by:</label>
        <input
          id="increment-by"
          type="number"
          value={incrementBy}
          onChange={(e) => setIncrementBy(parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>

      <div className="counter-actions">
        <button onClick={() => void handleIncrement()} disabled={loading}>
          Increment
        </button>
        <button onClick={handleReset} disabled={loading} className="secondary">
          Reset
        </button>
      </div>
      <div className={`status ${status.startsWith('Error') ? 'error' : ''}`}>{status}</div>
    </div>
  )
}

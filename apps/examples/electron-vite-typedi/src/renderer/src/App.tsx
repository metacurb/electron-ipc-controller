import './assets/main.css'

import { Counter } from './components/Counter'

function App(): React.JSX.Element {
  return (
    <>
      <div className="text">electron-ipc-bridge demo</div>
      <div className="text">
        Fully typed IPC with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <Counter />
    </>
  )
}

export default App

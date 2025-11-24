import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { api } from './services/api'

function App() {
  const [count, setCount] = useState(0)
  const [backendMessage, setBackendMessage] = useState<string>('');

  useEffect(() => {
    if (window.electronAPI) {
      const version = window.electronAPI.getVersion();
      console.log('Electron version:', version);
    }
  },
  []);

  useEffect(() => {
  // Attendre un peu que le backend soit prêt
  const timer = setTimeout(() => {
    api.get('/api/test')
      .then((data) => setBackendMessage(data.message || JSON.stringify(data)))
      .catch((error) => console.error('Erreur API:', error));
  }, 1000); // Attendre 1 seconde

  return () => clearTimeout(timer);
}, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {backendMessage && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>
            <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>✅ Backend répond :</p>
            <p style={{ color: '#fff' }}>{backendMessage}</p>
          </div>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { utils } from '@noble/hashes'

// Configure @noble/hashes to use browser's Web Crypto API
utils.setBackend(crypto)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
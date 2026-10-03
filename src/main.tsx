import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './styles/tailwind.css' // Seu CSS principal
import { BrowserRouter } from 'react-router-dom' // <-- Adicione o import

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Envolva o App com o BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import PresentationPage from './components/PresentationPage'

function App() {
  // Inicia na view correta com base no hash da URL
  const [view, setView] = useState(() => {
    const hash = window.location.hash
    // Aceita tanto #proposta quanto #apresentacao para evitar confusão
    return (hash === '#proposta' || hash === '#apresentacao') ? 'presentation' : 'landing'
  })

  // Sincroniza a URL com o estado da view para permitir links diretos
  useEffect(() => {
    if (view === 'presentation') {
      if (window.location.hash !== '#apresentacao') {
        window.location.hash = '#apresentacao'
      }
    } else {
      if (window.location.hash !== '') {
        // Remove o hash de forma limpa
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  }, [view])

  return (
    <div className="App">
      {/* Botão de alternância flutuante e elegante no rodapé */}
      <div style={{
        position: 'fixed', 
        bottom: '30px', 
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10001,
        background: 'rgba(13, 51, 34, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '8px',
        borderRadius: '50px',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button 
          onClick={() => setView('landing')}
          style={{
            background: view === 'landing' ? '#D4880A' : 'transparent',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 800,
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Visualizar Landing
        </button>
        <button 
          onClick={() => setView('presentation')}
          style={{
            background: view === 'presentation' ? '#D4880A' : 'transparent',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 800,
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Proposta SaaS
        </button>
      </div>

      {view === 'landing' ? <LandingPage /> : <PresentationPage />}
    </div>
  )
}

export default App

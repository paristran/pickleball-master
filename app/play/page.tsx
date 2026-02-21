'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Play() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [gameCode, setGameCode] = useState('')

  const createGame = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGameCode(code)
    alert(`Game created! Code: ${code}`)
  }

  const joinGame = () => {
    alert(`Joining game: ${code}`)
  }

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#3B82F6' }}>← Back</Link>
      <h1 style={{ fontSize: 40, marginBottom: 30 }}>🎮 Play Pickleball</h1>
      
      <div style={{ marginBottom: 40, padding: 20, background: '#f3f4f6', borderRadius: 10 }}>
        <h2>Create Game</h2>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, width: '100%', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
        />
        <button onClick={createGame} style={{ padding: 15, background: '#10B981', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', width: '100%' }}>
          Create New Game
        </button>
        {gameCode && <p style={{ marginTop: 10 }}>Game Code: <strong>{gameCode}</strong></p>}
      </div>
      
      <div style={{ padding: 20, background: '#f3f4f6', borderRadius: 10 }}>
        <h2>Join Game</h2>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, width: '100%', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Game code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          style={{ padding: 10, width: '100%', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
          maxLength={6}
        />
        <button onClick={joinGame} style={{ padding: 15, background: '#3B82F6', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', width: '100%' }}>
          Join Game
        </button>
      </div>
    </main>
  )
}

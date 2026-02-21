'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Simple in-memory game state (persists across clients via API)
interface GameSession {
  id: string
  name: string
  players: { id: string; name: string; team: 1 | 2 }[]
  status: 'waiting' | 'playing' | 'finished'
  score: { team1: number; team2: number }
  createdAt: number
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 8).toUpperCase()

export default function Play() {
  const router = useRouter()
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [playerName, setPlayerName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [loading, setLoading] = useState(false)

  // Load sessions from localStorage (simulated server state)
  useEffect(() => {
    const saved = localStorage.getItem('pickleball-sessions')
    if (saved) {
      setSessions(JSON.parse(saved))
    }
  }, [])

  // Save sessions
  const saveSessions = useCallback((newSessions: GameSession[]) => {
    setSessions(newSessions)
    localStorage.setItem('pickleball-sessions', JSON.stringify(newSessions))
  }, [])

  // Create new session
  const createSession = () => {
    if (!playerName || !sessionName) return
    setLoading(true)

    const playerId = generateId()
    const session: GameSession = {
      id: generateId(),
      name: sessionName,
      players: [{ id: playerId, name: playerName, team: 1 }],
      status: 'waiting',
      score: { team1: 0, team2: 0 },
      createdAt: Date.now()
    }

    // Store player info
    localStorage.setItem('pickleball-player', JSON.stringify({ id: playerId, name: playerName }))

    const newSessions = [...sessions, session]
    saveSessions(newSessions)
    
    setLoading(false)
    router.push(`/play/${session.id}`)
  }

  // Join session
  const joinSession = () => {
    if (!playerName || !joinCode) return
    setLoading(true)

    const session = sessions.find(s => s.id === joinCode.toUpperCase())
    if (!session) {
      alert('Game not found! Check the code.')
      setLoading(false)
      return
    }

    if (session.players.length >= 4) {
      alert('Game is full!')
      setLoading(false)
      return
    }

    const playerId = generateId()
    const team: 1 | 2 = session.players.filter(p => p.team === 1).length <= session.players.filter(p => p.team === 2).length ? 1 : 2

    // Store player info
    localStorage.setItem('pickleball-player', JSON.stringify({ id: playerId, name: playerName }))

    // Update session
    const updatedSessions = sessions.map(s => {
      if (s.id === session.id) {
        return { ...s, players: [...s.players, { id: playerId, name: playerName, team }] }
      }
      return s
    })
    saveSessions(updatedSessions)

    setLoading(false)
    router.push(`/play/${session.id}`)
  }

  // Get active sessions
  const activeSessions = sessions.filter(s => s.status === 'waiting' && s.players.length < 4)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">🏓 Pickleball Master</Link>
          <div className="flex gap-4">
            <Link href="/learn" className="text-gray-500 hover:text-blue-600">Learn</Link>
            <Link href="/play" className="text-blue-600 font-medium">Play</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="mb-4">Play Pickleball</h1>
          <p className="text-xl text-gray-500">Create or join a game with friends</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <button 
            onClick={() => { setShowCreate(true); setShowJoin(false) }}
            className="card text-center py-12 hover:border-blue-500 border-2 border-transparent"
          >
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">Create Game</h3>
            <p className="text-gray-500">Start a new session and invite friends</p>
          </button>
          <button 
            onClick={() => { setShowJoin(true); setShowCreate(false) }}
            className="card text-center py-12 hover:border-green-500 border-2 border-transparent"
          >
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">Join Game</h3>
            <p className="text-gray-500">Enter a code to join an existing game</p>
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold mb-6">Create New Game</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input 
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game Name</label>
                <input 
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Friday Night Pickleball"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={createSession}
                  disabled={!playerName || !sessionName || loading}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Game'}
                </button>
                <button onClick={() => setShowCreate(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Join Form */}
        {showJoin && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold mb-6">Join Game</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input 
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game Code</label>
                <input 
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={joinSession}
                  disabled={!playerName || !joinCode || loading}
                  className="btn btn-accent flex-1 disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join Game'}
                </button>
                <button onClick={() => setShowJoin(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Active Games */}
        {activeSessions.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Open Games</h3>
            <div className="space-y-4">
              {activeSessions.map(session => (
                <div key={session.id} className="card flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{session.name}</h4>
                    <p className="text-gray-500 text-sm">{session.players.length}/4 players • Code: {session.id}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setJoinCode(session.id)
                      setShowJoin(true)
                      setShowCreate(false)
                    }}
                    className="btn btn-primary"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 card bg-gray-50">
          <h3 className="font-semibold mb-4">📱 How to Play</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>Desktop:</strong> Arrow keys to move, Space to swing</li>
            <li>• <strong>Mobile:</strong> Touch controls on screen</li>
            <li>• First to 11 points wins (win by 2)</li>
            <li>• Share your game code with friends to play together</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

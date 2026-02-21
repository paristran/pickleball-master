'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// Types
interface Player {
  id: string
  name: string
  team: 1 | 2
  x: number
  y: number
  width: number
  height: number
}

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

interface GameState {
  id: string
  name: string
  players: Player[]
  status: 'waiting' | 'playing' | 'finished'
  score: { team1: number; team2: number }
  ball: Ball
  server: 1 | 2
  rallyActive: boolean
}

// Constants
const COURT_WIDTH = 400
const COURT_HEIGHT = 600
const KITCHEN_DEPTH = 42
const PADDLE_WIDTH = 20
const PADDLE_HEIGHT = 60
const BALL_RADIUS = 8
const PLAYER_SPEED = 4
const BALL_SPEED = 5

const generateId = () => Math.random().toString(36).substring(2, 8).toUpperCase()

export default function Game() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.id as string

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [player, setPlayer] = useState<{ id: string; name: string } | null>(null)
  const [keys, setKeys] = useState<Record<string, boolean>>({})
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const playerData = localStorage.getItem('pickleball-player')
    if (playerData) setPlayer(JSON.parse(playerData))

    const sessions = JSON.parse(localStorage.getItem('pickleball-sessions') || '[]')
    const session = sessions.find((s: GameState) => s.id === gameId)
    
    if (session) {
      if (!session.ball) {
        session.ball = {
          x: COURT_WIDTH / 2, y: COURT_HEIGHT / 2,
          vx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
          vy: BALL_SPEED, radius: BALL_RADIUS
        }
      }
      session.players = session.players.map((p: Player) => ({
        ...p,
        x: p.x || COURT_WIDTH / 2 - PADDLE_WIDTH / 2,
        y: p.y || (p.team === 1 ? COURT_HEIGHT - 60 : 40),
        width: PADDLE_WIDTH, height: PADDLE_HEIGHT
      }))
      setGameState(session)
    }
    setIsMobile('ontouchstart' in window)
  }, [gameId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }))
      if (e.key === ' ') { e.preventDefault(); handleSwing() }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }))
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp) }
  }, [])

  const handleSwing = useCallback(() => {
    if (!gameState || !player || !gameState.rallyActive) return
    const currentPlayer = gameState.players.find(p => p.id === player.id)
    if (!currentPlayer) return
    const ball = gameState.ball
    if (ball.x + ball.radius > currentPlayer.x && ball.x - ball.radius < currentPlayer.x + PADDLE_WIDTH &&
        ball.y + ball.radius > currentPlayer.y && ball.y - ball.radius < currentPlayer.y + PADDLE_HEIGHT) {
      ball.vx = ((ball.x - (currentPlayer.x + PADDLE_WIDTH / 2)) / PADDLE_WIDTH) * BALL_SPEED * 2
      ball.vy = currentPlayer.team === 1 ? -BALL_SPEED : BALL_SPEED
      setGameState({ ...gameState, ball: { ...ball } })
    }
  }, [gameState, player])

  useEffect(() => {
    if (!gameState || gameState.status !== 'playing') return
    const gameLoop = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev
        const newPlayers = prev.players.map(p => {
          if (p.id === player?.id) {
            let newX = p.x, newY = p.y
            if (keys['ArrowLeft'] || keys['a']) newX -= PLAYER_SPEED
            if (keys['ArrowRight'] || keys['d']) newX += PLAYER_SPEED
            if (keys['ArrowUp'] || keys['w']) newY -= PLAYER_SPEED
            if (keys['ArrowDown'] || keys['s']) newY += PLAYER_SPEED
            newX = Math.max(0, Math.min(COURT_WIDTH - PADDLE_WIDTH, newX))
            newY = Math.max(0, Math.min(COURT_HEIGHT - PADDLE_HEIGHT, newY))
            if (p.team === 1 && newY < COURT_HEIGHT - KITCHEN_DEPTH) newY = COURT_HEIGHT - KITCHEN_DEPTH
            if (p.team === 2 && newY > KITCHEN_DEPTH - PADDLE_HEIGHT) newY = KITCHEN_DEPTH - PADDLE_HEIGHT
            return { ...p, x: newX, y: newY }
          }
          return p
        })
        const ball = { ...prev.ball }
        ball.x += ball.vx; ball.y += ball.vy
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > COURT_WIDTH) {
          ball.vx = -ball.vx
          ball.x = Math.max(ball.radius, Math.min(COURT_WIDTH - ball.radius, ball.x))
        }
        let newScore = { ...prev.score }, rallyActive = prev.rallyActive
        if (ball.y < 0) { newScore.team1++; rallyActive = false; ball.x = COURT_WIDTH/2; ball.y = COURT_HEIGHT/2; ball.vy = -BALL_SPEED }
        if (ball.y > COURT_HEIGHT) { newScore.team2++; rallyActive = false; ball.x = COURT_WIDTH/2; ball.y = COURT_HEIGHT/2; ball.vy = BALL_SPEED }
        let status = prev.status
        if (newScore.team1 >= 11 || newScore.team2 >= 11) status = 'finished'
        return { ...prev, players: newPlayers, ball, score: newScore, rallyActive, status }
      })
    }, 1000 / 60)
    return () => clearInterval(gameLoop)
  }, [gameState?.status, keys, player?.id])

  useEffect(() => {
    if (!canvasRef.current || !gameState) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#38A169'; ctx.fillRect(0, 0, COURT_WIDTH, COURT_HEIGHT)
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2
    ctx.strokeRect(2, 2, COURT_WIDTH - 4, COURT_HEIGHT - 4)
    ctx.beginPath(); ctx.moveTo(0, COURT_HEIGHT/2); ctx.lineTo(COURT_WIDTH, COURT_HEIGHT/2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, KITCHEN_DEPTH); ctx.lineTo(COURT_WIDTH, KITCHEN_DEPTH)
    ctx.moveTo(0, COURT_HEIGHT-KITCHEN_DEPTH); ctx.lineTo(COURT_WIDTH, COURT_HEIGHT-KITCHEN_DEPTH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(COURT_WIDTH/2, KITCHEN_DEPTH); ctx.lineTo(COURT_WIDTH/2, COURT_HEIGHT-KITCHEN_DEPTH); ctx.stroke()
    gameState.players.forEach(p => {
      ctx.fillStyle = p.team === 1 ? '#3B82F6' : '#EF4444'
      ctx.fillRect(p.x, p.y, PADDLE_WIDTH, PADDLE_HEIGHT)
      ctx.fillStyle = 'white'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(p.name.substring(0, 6), p.x + PADDLE_WIDTH/2, p.y - 5)
    })
    ctx.beginPath(); ctx.arc(gameState.ball.x, gameState.ball.y, BALL_RADIUS, 0, Math.PI*2)
    ctx.fillStyle = '#FFEB3B'; ctx.fill(); ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.stroke()
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(10, COURT_HEIGHT/2-30, 60, 60)
    ctx.fillStyle = 'white'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText(`${gameState.score.team2}`, 40, COURT_HEIGHT/2 - 5)
    ctx.fillText(`${gameState.score.team1}`, 40, COURT_HEIGHT/2 + 25)
  }, [gameState])

  const startGame = () => {
    if (!gameState) return
    setGameState({ ...gameState, status: 'playing', rallyActive: true })
  }

  const serve = () => {
    if (!gameState || gameState.rallyActive) return
    setGameState({ ...gameState, rallyActive: true, ball: { ...gameState.ball, vy: gameState.server === 1 ? -BALL_SPEED : BALL_SPEED } })
  }

  if (!gameState) {
    return <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-600">Game not found</p>
        <Link href="/play" className="btn btn-primary mt-4">Back to Lobby</Link>
      </div>
    </main>
  }

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 px-4 py-3 flex justify-between items-center">
        <Link href="/play" className="text-white text-xl">←</Link>
        <div className="text-center">
          <p className="text-white font-semibold">{gameState.name}</p>
          <p className="text-gray-400 text-sm">Code: {gameState.id}</p>
        </div>
        <div className="text-white font-bold">{gameState.score.team1} - {gameState.score.team2}</div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <canvas ref={canvasRef} width={COURT_WIDTH} height={COURT_HEIGHT} className="game-canvas" style={{ maxWidth: '100vw', maxHeight: 'calc(100vh - 200px)' }} />
          {gameState.status === 'waiting' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl">
              <p className="text-white text-xl mb-4">Waiting for players...</p>
              <p className="text-gray-300 mb-4">{gameState.players.length}/4 joined</p>
              {gameState.players.map(p => <p key={p.id} className="text-white">👤 {p.name} (Team {p.team})</p>)}
              {gameState.players.length >= 2 && <button onClick={startGame} className="btn btn-accent mt-4">Start Game</button>}
            </div>
          )}
          {gameState.status === 'finished' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl">
              <p className="text-white text-3xl font-bold mb-4">🎉 Game Over!</p>
              <p className="text-white text-xl mb-6">Team {gameState.score.team1 > gameState.score.team2 ? '1' : '2'} Wins!</p>
              <Link href="/play" className="btn btn-primary">Play Again</Link>
            </div>
          )}
        </div>
      </div>
      {gameState.status === 'playing' && (
        <div className="bg-gray-800 p-4">
          <div className="flex justify-center gap-4">
            {!gameState.rallyActive && <button onClick={serve} className="btn btn-accent text-lg px-8">🏸 Serve</button>}
            <button onClick={handleSwing} className="btn btn-primary text-lg px-8">💥 Swing</button>
          </div>
          {isMobile && (
            <div className="mt-4 flex justify-center">
              <div className="grid grid-cols-3 gap-2">
                <div></div>
                <button className="touch-control" onTouchStart={() => setKeys(p => ({...p, ArrowUp:true}))} onTouchEnd={() => setKeys(p => ({...p, ArrowUp:false}))}>▲</button>
                <div></div>
                <button className="touch-control" onTouchStart={() => setKeys(p => ({...p, ArrowLeft:true}))} onTouchEnd={() => setKeys(p => ({...p, ArrowLeft:false}))}>◀</button>
                <div></div>
                <button className="touch-control" onTouchStart={() => setKeys(p => ({...p, ArrowRight:true}))} onTouchEnd={() => setKeys(p => ({...p, ArrowRight:false}))}>▶</button>
                <div></div>
                <button className="touch-control" onTouchStart={() => setKeys(p => ({...p, ArrowDown:true}))} onTouchEnd={() => setKeys(p => ({...p, ArrowDown:false}))}>▼</button>
                <div></div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

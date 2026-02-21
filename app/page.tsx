import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 60, marginBottom: 20 }}>🏓 Pickleball Master</h1>
      <p style={{ fontSize: 20, marginBottom: 40 }}>Learn rules and play with friends</p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        <Link href="/learn" style={{ padding: 20, background: '#3B82F6', color: 'white', borderRadius: 10, textDecoration: 'none' }}>
          📚 Learn Rules
        </Link>
        <Link href="/play" style={{ padding: 20, background: '#10B981', color: 'white', borderRadius: 10, textDecoration: 'none' }}>
          🎮 Play Game
        </Link>
      </div>
    </main>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-blue-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-7xl mb-8 animate-bounce-slow">🏓</div>
          <h1 className="mb-6">
            <span className="gradient-text">Pickleball</span><br/>
            <span className="text-gray-300">Master</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Learn the rules, master strategies, and play with friends in real-time 2D games
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/play" className="btn btn-primary text-lg px-10 py-5">
              🎮 Play Now
            </Link>
            <Link href="/learn" className="btn btn-secondary text-lg px-10 py-5">
              📚 Learn Rules
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Learn Rules</h3>
              <p className="text-gray-500">Complete guide to pickleball rules, scoring, and court layout</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Master Strategies</h3>
              <p className="text-gray-500">Pro tips and tactics to improve your game</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">Play Online</h3>
              <p className="text-gray-500">Create or join games with up to 4 players</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center mb-16">How to Play</h2>
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create or Join a Game</h3>
                <p className="text-gray-500">Start a new session or enter a game code to join friends</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Team</h3>
                <p className="text-gray-500">Play singles (1v1) or doubles (2v2) - up to 4 players</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Play & Score</h3>
                <p className="text-gray-500">Use keyboard or touch controls to move, swing, and score points</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6">Ready to Play?</h2>
          <p className="text-xl opacity-90 mb-10">
            Join thousands of players learning and mastering pickleball
          </p>
          <Link href="/play" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-12 py-5">
            🎮 Start Playing →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 text-center">
        <p className="text-2xl mb-2">🏓 Pickleball Master</p>
        <p className="text-sm">Learn • Play • Master</p>
      </footer>
    </main>
  )
}

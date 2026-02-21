import Link from 'next/link'
import { useState } from 'react'

const rules = [
  {
    id: 'basics',
    title: 'The Basics',
    emoji: '📋',
    content: [
      { q: 'What is pickleball?', a: 'A paddle sport combining elements of tennis, badminton, and ping-pong, played on a badminton-sized court with a modified tennis net.' },
      { q: 'How many players?', a: 'Can be played as singles (1v1) or doubles (2v2). Doubles is more common.' },
      { q: 'What equipment?', a: 'Paddle (similar to oversized ping-pong paddle), plastic wiffle ball, and a court 20×44 feet.' },
    ]
  },
  {
    id: 'scoring',
    title: 'Scoring System',
    emoji: '🎯',
    content: [
      { q: 'How do you win?', a: 'First team to reach 11 points, winning by 2 points. Games can go beyond 11 if needed.' },
      { q: 'Who can score?', a: 'Only the serving team can score points. Receiving team must win the rally to gain the serve.' },
      { q: 'Score format?', a: 'Score is called as three numbers: [serving team score] - [receiving team score] - [server number: 1 or 2]. Example: "7-3-2"' },
    ]
  },
  {
    id: 'serving',
    title: 'Serving Rules',
    emoji: '🏸',
    content: [
      { q: 'How to serve?', a: 'Underhand serve, paddle below waist, ball must clear the non-volley zone (kitchen) and land in diagonal service court.' },
      { q: 'Server rotation?', a: 'In doubles, each player on a team serves until their team loses a rally. Then serve goes to opponents.' },
      { q: 'Starting serve?', a: 'First server starts on right side. After scoring, switch sides with partner.' },
    ]
  },
  {
    id: 'kitchen',
    title: 'The Kitchen (Non-Volley Zone)',
    emoji: '🚫',
    content: [
      { q: 'What is the kitchen?', a: 'The 7-foot zone on each side of the net. You CANNOT volley (hit in air) while standing in this zone.' },
      { q: 'Can you enter the kitchen?', a: 'Yes, but only to hit a ball that has bounced. You must exit before volleying again.' },
      { q: 'Kitchen violation?', a: 'If you volley while touching the kitchen line or zone, it\'s a fault - point or serve lost.' },
    ]
  },
  {
    id: 'faults',
    title: 'Faults (Errors)',
    emoji: '❌',
    content: [
      { q: 'Common faults?', a: 'Ball out of bounds, not clearing net, volleying in kitchen, double bounce, wrong serve.' },
      { q: 'Double bounce rule?', a: 'Ball must bounce ONCE on each side before volleys are allowed (serve return must bounce, then return of that must bounce).' },
      { q: 'What happens on fault?', a: 'If serving team faults: side out or second server loses serve. If receiving team faults: serving team scores.' },
    ]
  }
]

const strategies = [
  {
    id: 'dinking',
    title: 'Dinking Strategy',
    emoji: '🎯',
    tips: [
      'Dink into the opponent\'s weaker side (usually backhand)',
      'Aim for the corners of the kitchen',
      'Keep dinks unattackable - low over the net',
      'Be patient - wait for opponent to make errors'
    ]
  },
  {
    id: 'third-shot',
    title: 'Third Shot Drop',
    emoji: '🎾',
    tips: [
      'The third shot (after serve and return) should be a soft drop into the kitchen',
      'This gives your team time to move forward',
      'Aim for the middle of the kitchen to reduce angles',
      'Practice makes perfect - this is the most important shot'
    ]
  },
  {
    id: 'positioning',
    title: 'Court Positioning',
    emoji: '📍',
    tips: [
      'Move to the non-volley line after the third shot',
      'Stay balanced - don\'t get pulled out of position',
      'Communicate with your partner on coverage',
      'Middle shots = both players\' responsibility'
    ]
  },
  {
    id: 'communication',
    title: 'Partner Communication',
    emoji: '🗣️',
    tips: [
      'Call "mine" or "yours" on every shot',
      'Discuss strategy before games',
      'Use hand signals for serve direction',
      'Encourage each other - stay positive!'
    ]
  },
  {
    id: 'defense',
    title: 'Defensive Tactics',
    emoji: '🛡️',
    tips: [
      'When pushed back, reset with a dink',
      'Lobs can catch opponents at the net off guard',
      'Watch the opponent\'s paddle angle for shot prediction',
      'Stay relaxed - tense muscles = slow reactions'
    ]
  },
  {
    id: 'attacking',
    title: 'Attacking',
    emoji: '⚔️',
    tips: [
      'Attack balls above net height only',
      'Aim for the middle or open spaces',
      'Follow your attack to the net',
      'Don\'t overhit - controlled power wins'
    ]
  }
]

export default function Learn() {
  const [activeTab, setActiveTab] = useState<'rules' | 'strategies'>('rules')
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">🏓 Pickleball Master</Link>
          <div className="flex gap-4">
            <Link href="/learn" className="text-blue-600 font-medium">Learn</Link>
            <Link href="/play" className="text-gray-500 hover:text-blue-600">Play</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-blue-50 to-white text-center">
        <h1 className="mb-4">Learn Pickleball</h1>
        <p className="text-xl text-gray-500">Master the rules and strategies to dominate on the court</p>
      </section>

      {/* Tabs */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 justify-center mb-12">
            <button 
              onClick={() => setActiveTab('rules')}
              className={`px-8 py-3 rounded-full font-medium transition ${activeTab === 'rules' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              📋 Rules
            </button>
            <button 
              onClick={() => setActiveTab('strategies')}
              className={`px-8 py-3 rounded-full font-medium transition ${activeTab === 'strategies' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              🎯 Strategies
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {rules.map(rule => (
                <div key={rule.id} className="card">
                  <button 
                    onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{rule.emoji}</span>
                      <h3 className="text-xl font-semibold">{rule.title}</h3>
                    </div>
                    <span className="text-2xl text-gray-400">{expandedRule === rule.id ? '−' : '+'}</span>
                  </button>
                  {expandedRule === rule.id && (
                    <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
                      {rule.content.map((item, i) => (
                        <div key={i} className="pl-4 border-l-2 border-blue-200">
                          <p className="font-medium text-gray-800 mb-1">{item.q}</p>
                          <p className="text-gray-600">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'strategies' && (
            <div className="grid md:grid-cols-2 gap-6">
              {strategies.map(strategy => (
                <div key={strategy.id} className="card">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{strategy.emoji}</span>
                    <h3 className="text-xl font-semibold">{strategy.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {strategy.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-green-500 mt-1">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <p className="text-xl text-gray-600 mb-6">Ready to test your skills?</p>
        <Link href="/play" className="btn btn-primary text-lg px-10 py-4">
          🎮 Play Now
        </Link>
      </section>
    </main>
  )
}

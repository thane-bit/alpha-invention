import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Copy, ChevronDown, X } from 'lucide-react'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import requirementsPrompt from '../prompts/requirements.md?raw'
import scoperPrompt from '../prompts/scoper.md?raw'
import triagePrompt from '../prompts/triage.md?raw'

const CARD_EASE = [0.22, 1, 0.36, 1] as const

interface InfoCard {
  id: string
  number: string
  title: string
  icon: string
  items: string[]
  promptTitle: string
  prompt: string
}

const INFO_CARDS: InfoCard[] = [
  {
    id: 'requirements',
    number: '01',
    title: 'Set Requirements.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      'Map 15 constraint categories, from physics to regulation',
      'Wrap every outcome in a wikilinked argument tree',
      'Tag strategy moves: #Upstream, #analog, #max-scale',
      'Surface the master regulator behind the bottleneck',
    ],
    promptTitle: 'System Prompt: Requirements',
    prompt: requirementsPrompt,
  },
  {
    id: 'scoper',
    number: '02',
    title: 'Scope 200 Lines.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      'Exhaustive blueprint of intervention pathways',
      'Adversarial Con / HCon / Sol / HSol phrasing',
      'Creative-move toolkit: #Decouple, #re-lense, #Paradox',
    ],
    promptTitle: 'System Prompt: SCOPER 2.2.a',
    prompt: scoperPrompt,
  },
  {
    id: 'triage',
    number: '03',
    title: 'Rank Approaches.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      'Score upside — market size and root-cause resolution',
      'Score neglect — whitespace and mechanistic novelty',
      'Score traction — prototype feasibility in 1–3 years',
    ],
    promptTitle: 'System Prompt: Venture-Science Triage Evaluator',
    prompt: triagePrompt,
  },
]

function VideoCard() {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[380px] lg:h-full">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p
          className="text-xl font-medium sm:text-2xl"
          style={{ color: '#E1E0CC' }}
        >
          Your invention canvas.
        </p>
      </div>
    </div>
  )
}

function FeatureCard({
  card,
  isOpen,
  onToggle,
}: {
  card: InfoCard
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl bg-[#212121] p-6 transition-shadow duration-300 ${
        isOpen ? 'ring-1 ring-primary/50' : ''
      }`}
    >
      <img
        src={card.icon}
        alt=""
        className="h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12"
      />

      <h3 className="mt-6 flex items-baseline gap-2 text-lg font-bold sm:text-xl">
        <span style={{ color: '#E1E0CC' }}>{card.title}</span>
        <span className="text-gray-500 text-xs">{card.number}</span>
      </h3>

      <ul className="mt-5 flex flex-1 flex-col gap-3">
        {card.items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-gray-400 text-xs leading-snug sm:text-sm">
              {item}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="text-primary group mt-6 flex items-center gap-1.5 text-xs font-medium sm:text-sm"
      >
        {isOpen ? 'Hide prompt' : 'View prompt'}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  )
}

export default function Features() {
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(gridRef, { once: true, margin: '-100px' })

  const [openId, setOpenId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const activeCard = INFO_CARDS.find((c) => c.id === openId) ?? null

  const toggle = (id: string) => {
    setCopied(false)
    setOpenId((current) => (current === id ? null : id))
  }

  const copyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  const cards = [
    { node: <VideoCard key="video" />, key: 'video' },
    ...INFO_CARDS.map((card) => ({
      key: card.id,
      node: (
        <FeatureCard
          key={card.id}
          card={card}
          isOpen={openId === card.id}
          onToggle={() => toggle(card.id)}
        />
      ),
    })),
  ]

  return (
    <section className="relative min-h-screen bg-black px-4 py-24 sm:px-6 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex justify-center text-center md:mb-16">
          <WordsPullUpMultiStyle
            className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[
              {
                text: 'Studio-grade workflows for systematic inventors.',
                className: '',
              },
              {
                text: 'Built for pure rigor. Powered by adversarial scoping.',
                className: 'text-gray-500',
              },
            ]}
          />
        </div>

        {/* Card grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4"
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={
                isInView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.95, opacity: 0 }
              }
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: CARD_EASE,
              }}
              className="h-full"
            >
              {card.node}
            </motion.div>
          ))}
        </div>

        {/* Inline expandable prompt panel */}
        <AnimatePresence initial={false}>
          {activeCard && (
            <motion.div
              key="prompt-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: CARD_EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
                {/* Panel header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-primary text-[10px] uppercase tracking-[0.3em]">
                      {activeCard.title.replace('.', '')} · Step{' '}
                      {activeCard.number}
                    </p>
                    <h4
                      className="mt-1 text-base font-bold sm:text-lg"
                      style={{ color: '#E1E0CC' }}
                    >
                      {activeCard.promptTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyPrompt(activeCard.prompt)}
                      className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-black transition-transform duration-200 hover:scale-[1.03] sm:text-sm"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy prompt
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setOpenId(null)}
                      aria-label="Close prompt"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-colors hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Prompt body */}
                <pre className="mt-4 max-h-[55vh] overflow-auto whitespace-pre rounded-xl bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-gray-300 sm:text-xs">
                  {activeCard.prompt}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

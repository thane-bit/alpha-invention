import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ChevronDown, X } from 'lucide-react'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import {
  GEMINI_SHARE_URL,
  CELL_CRYPTO_URL,
  PROTOCOL_URL,
  PRIMER_VIDEO_URL,
  SELF_HEALING_PAPER_URL,
} from '../links'

const CARD_EASE = [0.22, 1, 0.36, 1] as const

interface OptionLink {
  label: string
  description: string
  href: string
}

interface BaseCard {
  id: string
  number: string
  title: string
  icon: string
  items: string[]
}

interface OptionsCard extends BaseCard {
  kind: 'options'
  cta: string
  panelHeading: string
  options: OptionLink[]
}

interface OntologyCard extends BaseCard {
  kind: 'ontology'
}

type InfoCard = OptionsCard | OntologyCard

const INFO_CARDS: InfoCard[] = [
  {
    kind: 'options',
    id: 'worked-example',
    number: '01',
    title: 'Examples',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      'See how the prompts come together',
      'Worked runs from outcome to ranked approaches',
      'Single-player and think-tank scale',
    ],
    cta: 'View examples',
    panelHeading: 'Two worked examples',
    options: [
      {
        label: 'Net Zero Transport',
        description: 'Single-player Alpha run, 30 minutes.',
        href: GEMINI_SHARE_URL,
      },
      {
        label: 'Cell Crypto',
        description:
          'A think tank tackling what cybersecurity looks like when cells compute.',
        href: CELL_CRYPTO_URL,
      },
    ],
  },
  {
    kind: 'ontology',
    id: 'scoping-ontology',
    number: '02',
    title: 'Ontology',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      'The six key terms, by completeness and possibility',
      'Constraints and Solutions, hypothesised and confirmed',
      'Requirements, Tactics, and the probes that test them',
    ],
  },
  {
    kind: 'options',
    id: 'scoping-protocol',
    number: '03',
    title: 'Providence',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      'The origin of this invention system',
      'The Outcomes Graph protocol for applied-science coordination',
      'How structural scoping builds deep tech companies',
    ],
    cta: 'Where it came from',
    panelHeading: 'Where this system came from',
    options: [
      {
        label: 'Read the protocol',
        description: 'The Outcomes Graph write-up on applied-science coordination.',
        href: PROTOCOL_URL,
      },
      {
        label: 'Watch the protocol',
        description: 'A short Scoping Protocol primer video.',
        href: PRIMER_VIDEO_URL,
      },
    ],
  },
]

// Ontology grid: rows = COMPLETENESS (High → Low), columns = POSSIBILITY (Low → High).
const ONTOLOGY_ROWS: {
  level: string
  low: { term: string; token: string; phrase: string }
  high: { term: string; token: string; phrase: string }
}[] = [
  {
    level: 'High',
    low: {
      term: 'Constraint',
      token: '[[Con',
      phrase: 'It is not possible to…',
    },
    high: { term: 'Solution', token: '[[Sol', phrase: 'It is possible to…' },
  },
  {
    level: 'Med',
    low: {
      term: 'Hypothesised Constraint',
      token: '[[HCon',
      phrase: 'It might not be possible to…',
    },
    high: {
      term: 'Hypothesised Solution',
      token: '[[HSol',
      phrase: 'It might be possible to…',
    },
  },
  {
    level: 'Low',
    low: { term: 'Requirement', token: '#Req', phrase: 'Must have' },
    high: { term: 'Tactic', token: '#tactic', phrase: 'Could try' },
  },
]

function OntologyCell({
  term,
  token,
  phrase,
}: {
  term: string
  token: string
  phrase: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-black/40 p-4">
      <span className="text-sm font-bold sm:text-base" style={{ color: '#E1E0CC' }}>
        {term}
      </span>
      <span className="text-primary font-mono text-xs">{token}</span>
      <span className="text-gray-400 text-xs italic">{phrase}</span>
    </div>
  )
}

function OntologyTable() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        {/* POSSIBILITY axis header */}
        <div
          className="grid gap-2 pb-2"
          style={{ gridTemplateColumns: '92px 1fr 1fr' }}
        >
          <div className="flex items-end">
            <span className="text-primary/70 text-[9px] uppercase tracking-[0.2em]">
              Completeness ↓
            </span>
          </div>
          <div className="text-gray-500 text-[10px] uppercase tracking-[0.25em]">
            Possibility: Low
          </div>
          <div className="text-gray-300 text-[10px] uppercase tracking-[0.25em]">
            Possibility: High
          </div>
        </div>

        {/* Rows by completeness level */}
        <div className="flex flex-col gap-2">
          {ONTOLOGY_ROWS.map((row) => (
            <div
              key={row.level}
              className="grid gap-2"
              style={{ gridTemplateColumns: '92px 1fr 1fr' }}
            >
              <div className="flex items-center">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                  {row.level}
                </span>
              </div>
              <OntologyCell {...row.low} />
              <OntologyCell {...row.high} />
            </div>
          ))}
        </div>

        {/* Supporting tags */}
        <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5">
          <p className="text-gray-400 text-xs leading-relaxed sm:text-sm">
            <span className="text-primary font-mono">FPQ</span>{' '}
            <span style={{ color: '#E1E0CC' }}>— first principles question:</span>{' '}
            probing the logic of a hypothesised constraint to reveal ways around
            it.
          </p>
          <p className="text-gray-400 text-xs leading-relaxed sm:text-sm">
            <span className="text-primary font-mono">EVD</span>{' '}
            <span style={{ color: '#E1E0CC' }}>— evidence:</span> source material
            that validates our statement.
          </p>
        </div>
      </div>
    </div>
  )
}

// Token colours mirror the ontology table / graph convention.
const TOKEN = {
  outcome: '#E1E0CC',
  hcon: '#E8590C',
  con: '#E03131',
  hsol: '#2F9E44',
  tag: '#DEDBC8',
}

interface ChainRow {
  level: number
  token: string
  color: string
  text: string
  href?: string
}

interface Chain {
  heading: string
  caption: string
  rows: ChainRow[]
}

// Two worked chains from a Net Zero Transport graph, in plain language.
const EXAMPLE_CHAINS: Chain[] = [
  {
    heading: 'From outcome to requirements',
    caption:
      "An outcome isn't a solution — it breaks down into what any solution has to deliver.",
    rows: [
      {
        level: 0,
        token: '[[Outcome]]',
        color: TOKEN.outcome,
        text: 'A world where transport produces zero emissions',
      },
      {
        level: 1,
        token: '[[HCon]]',
        color: TOKEN.hcon,
        text: "This might not work unless clean options can actually do the job",
      },
      {
        level: 2,
        token: '[[Con]]',
        color: TOKEN.con,
        text: "Fossil transport won't be replaced if alternatives can't match payload, range and speed",
      },
      {
        level: 3,
        token: '#Req',
        color: TOKEN.tag,
        text: "Store as much energy per kilo and per litre as today's fuels",
      },
      {
        level: 3,
        token: '#Req',
        color: TOKEN.tag,
        text: 'Refuel or recharge as fast as filling a tank',
      },
      {
        level: 3,
        token: '#Req',
        color: TOKEN.tag,
        text: 'Keep working everywhere — from freezing skies to desert roads',
      },
    ],
  },
  {
    heading: 'Getting around an HCon with an FPQ',
    caption:
      'An HCon (hypothesised constraint) is a possible reason an idea might fail. A first-principles question digs into it to find a way around — answered by a new, evidenced solution.',
    rows: [
      {
        level: 0,
        token: '[[HSol]]',
        color: TOKEN.hsol,
        text: 'Move freight through vacuum tubes on magnetic levitation',
      },
      {
        level: 1,
        token: '[[HCon]]',
        color: TOKEN.hcon,
        text: 'The tubes might rupture and lose pressure catastrophically',
      },
      {
        level: 2,
        token: 'FPQ',
        color: TOKEN.tag,
        text: 'Why should one small breach take down the whole tube, instead of staying contained to one section?',
      },
      {
        level: 3,
        token: '[[HSol]]',
        color: TOKEN.hsol,
        text: 'Self-healing polymer joints with fast-closing blast gates',
      },
      {
        level: 4,
        token: '#EVD',
        color: TOKEN.tag,
        text: 'White 2001',
        href: SELF_HEALING_PAPER_URL,
      },
    ],
  },
]

function ChainBlock({ chain }: { chain: Chain }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5">
      <p className="text-sm font-bold sm:text-base" style={{ color: '#E1E0CC' }}>
        {chain.heading}
      </p>
      <p className="mt-1 text-gray-400 text-xs sm:text-sm">{chain.caption}</p>
      <div className="mt-4 flex flex-col gap-2 font-mono text-[11px] sm:text-xs">
        {chain.rows.map((row, i) => (
          <div
            key={i}
            className="flex items-baseline gap-2"
            style={{ paddingLeft: `${row.level * 1.1}rem` }}
          >
            <span className="flex-shrink-0 font-bold" style={{ color: row.color }}>
              {row.token}
            </span>
            {row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 underline underline-offset-2 hover:text-primary"
              >
                {row.text}
              </a>
            ) : (
              <span className="text-gray-300">{row.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ExampleChains() {
  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <p className="text-primary mb-4 text-[10px] uppercase tracking-[0.3em]">
        Example chains
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {EXAMPLE_CHAINS.map((chain) => (
          <ChainBlock key={chain.heading} chain={chain} />
        ))}
      </div>
    </div>
  )
}

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
          Bringing invention to life
        </p>
      </div>
    </div>
  )
}

function CardShell({
  card,
  isOpen,
  children,
}: {
  card: InfoCard
  isOpen: boolean
  children: React.ReactNode
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

      <h3 className="mt-6 text-lg font-bold sm:text-xl">
        <span style={{ color: '#E1E0CC' }}>{card.title}</span>
      </h3>

      <ul className="mt-5 flex flex-1 flex-col gap-3">
        {card.items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <ArrowUpRight className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-gray-400 text-xs leading-snug sm:text-sm">
              {item}
            </span>
          </li>
        ))}
      </ul>

      {children}
    </div>
  )
}

// Every info card is a toggle that expands the shared panel below the grid.
function ToggleFeatureCard({
  card,
  isOpen,
  onToggle,
}: {
  card: InfoCard
  isOpen: boolean
  onToggle: () => void
}) {
  const label =
    card.kind === 'ontology'
      ? isOpen
        ? 'Hide ontology'
        : 'View ontology'
      : isOpen
        ? 'Hide'
        : card.cta

  return (
    <CardShell card={card} isOpen={isOpen}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="text-primary group mt-6 flex items-center gap-1.5 text-xs font-medium sm:text-sm"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    </CardShell>
  )
}

function OptionsList({ options }: { options: OptionLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <a
          key={option.href}
          href={option.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-colors hover:border-primary/40"
        >
          <div className="flex flex-col gap-1">
            <span
              className="text-sm font-bold sm:text-base"
              style={{ color: '#E1E0CC' }}
            >
              {option.label}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">
              {option.description}
            </span>
          </div>
          <ArrowUpRight className="text-primary mt-0.5 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      ))}
    </div>
  )
}

export default function Features() {
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(gridRef, { once: true, margin: '-100px' })

  const [openId, setOpenId] = useState<string | null>(null)

  const activeCard = INFO_CARDS.find((c) => c.id === openId)

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  const cards = [
    { node: <VideoCard key="video" />, key: 'video' },
    ...INFO_CARDS.map((card) => ({
      key: card.id,
      node: (
        <ToggleFeatureCard
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
                text: 'What does running Alpha look like?',
                className: '',
              },
              {
                text: 'What is the language of invention?',
                className: 'text-gray-500',
              },
              {
                text: 'Where did this system come from?',
                className: '',
                breakBefore: true,
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

        {/* Inline expandable panel — ontology table or a list of links */}
        <AnimatePresence initial={false}>
          {activeCard && (
            <motion.div
              key="info-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: CARD_EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
                {/* Panel header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-primary text-[10px] uppercase tracking-[0.3em]">
                      {activeCard.title}
                    </p>
                    <h4
                      className="mt-1 text-base font-bold sm:text-lg"
                      style={{ color: '#E1E0CC' }}
                    >
                      {activeCard.kind === 'ontology'
                        ? 'The language of invention'
                        : activeCard.panelHeading}
                    </h4>
                    {activeCard.kind === 'ontology' && (
                      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-400 sm:text-sm">
                        Use these six terms as Lego bricks to build technologies
                        as arguments — laying out the case for and against each
                        one, and surfacing where it's weak and where it's
                        promising.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setOpenId(null)}
                    aria-label="Close panel"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-colors hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {activeCard.kind === 'ontology' ? (
                  <>
                    <OntologyTable />
                    <ExampleChains />
                  </>
                ) : (
                  <OptionsList options={activeCard.options} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

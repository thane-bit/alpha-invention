import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Copy, ChevronDown } from 'lucide-react'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import requirementsPrompt from '../prompts/requirements.md?raw'
import scoperPrompt from '../prompts/scoper.md?raw'
import triagePrompt from '../prompts/triage.md?raw'

const EASE = [0.22, 1, 0.36, 1] as const

interface Step {
  n: string
  id: string
  title: string
  tagline: string
  body?: string
  bullets?: string[]
  promptTitle?: string
  prompt?: string
}

const STEPS: Step[] = [
  {
    n: '01',
    id: 'step-1',
    title: 'Choose Outcome',
    tagline: "What does the world look like once it's solved?",
    body: 'Solve the global challenge you care about and the world looks like…',
  },
  {
    n: '02',
    id: 'step-2',
    title: 'Set Requirements',
    tagline: 'What needs to be true to find solutions in this space?',
    promptTitle: 'System Prompt: Requirements',
    prompt: requirementsPrompt,
  },
  {
    n: '03',
    id: 'step-3',
    title: 'Scope 200 Lines',
    tagline:
      "What's possible under these requirements, and the logic behind each approach?",
    promptTitle: 'System Prompt: SCOPER 2.2.a',
    prompt: scoperPrompt,
  },
  {
    n: '04',
    id: 'step-4',
    title: 'Rank Approaches',
    tagline:
      'Compared by Upside, Neglect and Traction — which approaches lead?',
    promptTitle: 'System Prompt: Venture-Science Triage Evaluator',
    prompt: triagePrompt,
  },
  {
    n: '05',
    id: 'step-5',
    title: 'Go Wide, Go Deep',
    tagline:
      "Don't settle for quick answers. Find the best approach of many to learn by comparison.",
    bullets: [
      "Expand the search space — repeat steps 3 + 4 until you have 30 ranked approaches. You'll notice the ranking shift each pass.",
      'Expand the leading 5 — run Phase 2 scoping (50 lines each) on the top 5 approaches, then repeat for phases 3 & 4.',
    ],
  },
  {
    n: '06',
    id: 'step-6',
    title: 'Convert to Spec',
    tagline: 'How does this become real?',
    bullets: [
      'Should any of the leading approaches be combined?',
      'What are the requirements (step 2 again) to turn them into working technologies?',
      'What are the key requirements to hit in 6 months of R&D?',
    ],
  },
  {
    n: '07',
    id: 'step-7',
    title: 'Find Collaborators',
    tagline: 'Who do you need to build with?',
    bullets: [
      'Make an experimental plan based on key near-term requirements.',
      'List 40–100 labs working in this space to run the killer experiments with — expect a ~1% response rate from cold email.',
      'Email them all; read their papers before the first meeting. In it: test whether they’d sign a letter of support / NDA (have templates ready — it tests intent and helps later fundraising), and pressure-test your experimental plan.',
    ],
  },
]

function StepRow({
  step,
  isOpen,
  onToggle,
}: {
  step: Step
  isOpen: boolean
  onToggle: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  return (
    <div
      id={step.id}
      className={`scroll-mt-24 rounded-2xl border bg-[#101010] transition-colors duration-300 ${
        isOpen ? 'border-primary/40' : 'border-white/10'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
      >
        <span className="text-primary text-sm font-bold tabular-nums sm:text-base">
          {step.n}
        </span>
        <span className="flex-1">
          <span
            className="block text-base font-bold sm:text-lg"
            style={{ color: '#E1E0CC' }}
          >
            {step.title}
          </span>
          <span className="mt-0.5 block text-xs text-gray-400 sm:text-sm">
            {step.tagline}
          </span>
        </span>
        <ChevronDown
          className={`text-primary h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-4 px-5 pb-6 sm:px-7">
              {step.body && (
                <p className="text-sm text-gray-300 sm:text-base">{step.body}</p>
              )}

              {step.bullets && (
                <ul className="flex flex-col gap-3">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm text-gray-300 sm:text-base">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {step.prompt && (
                <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4
                      className="text-sm font-bold sm:text-base"
                      style={{ color: '#E1E0CC' }}
                    >
                      {step.promptTitle}
                    </h4>
                    <button
                      onClick={() => copyPrompt(step.prompt as string)}
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
                  </div>
                  <pre className="mt-4 max-h-[55vh] overflow-auto whitespace-pre rounded-lg bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-gray-300 sm:text-xs">
                    {step.prompt}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Protocol() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true, margin: '-100px' })
  const [openId, setOpenId] = useState<string | null>(null)

  // Open the step targeted by the URL hash (#step-N) on load and on nav clicks.
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace('#', '')
      if (STEPS.some((s) => s.id === id)) setOpenId(id)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  return (
    <section id="protocol" className="bg-black px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div ref={headerRef} className="mb-12 flex justify-center text-center">
          <WordsPullUpMultiStyle
            className="text-2xl font-normal sm:text-3xl md:text-4xl lg:text-5xl"
            segments={[
              { text: 'The Protocol.', className: '' },
              {
                text: 'Seven steps from outcome to collaborators.',
                className: 'text-gray-500',
              },
            ]}
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col gap-3"
        >
          {STEPS.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              isOpen={openId === step.id}
              onToggle={() =>
                setOpenId((cur) => (cur === step.id ? null : step.id))
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

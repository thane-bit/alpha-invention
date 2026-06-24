import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Copy, ChevronDown } from 'lucide-react'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import requirementsPrompt from '../prompts/requirements.md?raw'
import scoperPrompt from '../prompts/scoper.md?raw'
import triagePrompt from '../prompts/triage.md?raw'
import { PROTOCOL_URL } from '../links'

const EASE = [0.22, 1, 0.36, 1] as const

// A numbered action within a step: a short label plus one or more copiable
// prompts to paste into the assistant in sequence.
interface Action {
  label?: string
  note?: string
  prompts: string[]
}

interface Step {
  n: string
  id: string
  title: string
  tagline: string
  narrative?: ReactNode
  body?: string
  bullets?: string[]
  actions?: Action[]
  promptTitle?: string
  prompt?: string
}

const STEPS: Step[] = [
  {
    n: '01',
    id: 'step-1',
    title: 'Choose Outcome',
    tagline: "What does the world look like once it's solved?",
    narrative:
      'Everything starts from the world you want to exist — not the technology you want to build. Describe that end-state vividly; Alpha reasons backwards from it, so the sharper the outcome, the stronger everything downstream.',
    body: 'Solve the global challenge you care about and the world looks like…',
  },
  {
    n: '02',
    id: 'step-2',
    title: 'Set Requirements',
    tagline: 'What needs to be true to find solutions in this space?',
    narrative:
      "Before hunting for solutions, you map the rules of the game: the hard constraints any answer must satisfy — physics, economics, regulation, biology. These become the filter that keeps the search honest and rules out approaches that can't work.",
    promptTitle: 'System Prompt: Requirements',
    prompt: requirementsPrompt,
  },
  {
    n: '03',
    id: 'step-3',
    title: 'Scope 200 Lines',
    tagline:
      "What's possible under these requirements, and the logic behind each approach?",
    narrative: (
      <>
        Now Alpha generates breadth. It maps a wide field of possible approaches
        as an{' '}
        <a
          href={PROTOCOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          Outcomes Graph
        </a>{' '}
        — an argument tree with each constraint paired with the solutions that
        overcome it — so you see not just what might work, but the reasoning and
        bottlenecks behind every path.
      </>
    ),
    promptTitle: 'System Prompt: SCOPER 2.2.a',
    prompt: scoperPrompt,
  },
  {
    n: '04',
    id: 'step-4',
    title: 'Rank Approaches',
    tagline:
      'Compared by Upside, Neglect and Traction — which approaches lead?',
    narrative:
      'With many approaches on the table, you score each on three axes: Upside (how big if it works), Neglect (how overlooked it is), and Traction (how provable in the near term). The ranking surfaces the few paths worth deeper investment.',
    promptTitle: 'System Prompt: Venture-Science Triage Evaluator',
    prompt: triagePrompt,
  },
  {
    n: '05',
    id: 'step-5',
    title: 'Go Wide, Go Deep',
    tagline:
      "Don't settle for quick answers. Find the best approach of many to learn by comparison.",
    narrative:
      'One pass is never enough. Widen the search until at least 30 approaches are ranked — the order shifts every pass — then deepen the leading five with further scoping. Breadth first, then depth, so the winner is chosen by comparison rather than by your first hunch.',
    actions: [
      {
        label:
          "Expand the search space — repeat steps 3 + 4 until you have ~30 ranked approaches. You'll notice the ranking shift each pass.",
        prompts: [
          'repeat the scoping prompt for 200 more lines of new approaches',
          'repeat the triaging prompt extending the table to include all approaches so far',
        ],
      },
      {
        label:
          'Expand the leading 5 — run Phase 2 scoping (50 lines each) on the top 5 approaches, then repeat for phases 3 & 4.',
        prompts: [
          'according to the scoping prompt run Phase 2 scoping on each of the top 5 approaches 50 lines each',
          'have you obeyed the strict definitions for phases 2,3,4 scoping?',
        ],
      },
    ],
  },
  {
    n: '06',
    id: 'step-6',
    title: 'Convert to Spec',
    tagline: 'How does this become real?',
    narrative:
      'Here a promising approach becomes a buildable plan. You re-rank the finalists, test whether any should be combined, then define what must be true for the approach to become working technology — and what a first prototype has to prove to win investment.',
    actions: [
      {
        label: 'Re-rank the leading approaches, then test whether any should be combined.',
        prompts: [
          'repeat the triaging prompt for these 5 approaches',
          'should any of these approaches be combined for an even better outcome?',
        ],
      },
      {
        label:
          'Define what must be true for an approach to become working technology.',
        note: 'When combining approaches, consider asking this for each approach in sequence.',
        prompts: [
          'using the requirements prompt set up what needs to be true for this approach to become working technology',
        ],
      },
      {
        label:
          "Separate what's already proven from what a first prototype must prove.",
        prompts: [
          'For this approach show what is already proven and what needs to be proven in a first prototype, assume that some engineering steps are more important to prove than others (if all cannot be simultaneously proven in a 6 month R&D timeframe) to convince venture capital investors to fund a startup building each approach into working technology',
        ],
      },
    ],
  },
  {
    n: '07',
    id: 'step-7',
    title: 'Find Collaborators',
    tagline: 'Who do you need to build with?',
    narrative:
      'An invention only matters if it gets built. You turn the spec into a six-month experimental plan, find the labs already working at the frontier, and reach out to run the killer experiments together — the start of a real venture.',
    actions: [
      {
        label: 'Build an experimental plan for each 6-month prototype milestone.',
        prompts: [
          'For this approach, create a detailed experimental plan for each 6-month prototype milestone that I can execute in an academic or corporate research lab',
        ],
      },
      {
        label:
          'Find the labs to run the killer experiments with — expect a ~1% response rate from cold email.',
        prompts: [
          'generate a table for this approach, of 40 academic research labs working on this who I can collaborate with. Columns should have their name, email address, university affiliation, top 2 related papers',
        ],
      },
      {
        label:
          'Draft a personalised cold-outreach email to send to every lab on the list.',
        prompts: [
          "create a short template email for cold outreach that I can personalise to each lab, the PI's name, that I am reaching out because I read their paper on [named paper], that I've built an experimental plan that could lead to [approach outcome] and that I'd like to come for [X] weeks to execute it with their supervision or consider writing a grant together. Show the swap-outs in green. Ask for a 15 mins intro call. Do not say I'm attaching the experimental plan",
        ],
      },
    ],
  },
]

// A single short prompt rendered as a click-to-copy box.
function CopyablePrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  return (
    <button
      onClick={copy}
      className="group flex w-full items-start gap-3 rounded-xl border border-white/10 bg-[#0b0b0b] p-3 text-left transition-colors hover:border-primary/40 sm:p-4"
    >
      <span className="flex-1 text-xs leading-relaxed text-gray-300 sm:text-sm">
        {text}
      </span>
      <span className="text-primary mt-0.5 flex flex-shrink-0 items-center gap-1 text-[10px] font-medium uppercase tracking-wide sm:text-xs">
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  )
}

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
              {step.narrative && (
                <p className="border-l-2 border-primary/40 pl-4 text-sm italic leading-relaxed text-gray-400 sm:text-base">
                  {step.narrative}
                </p>
              )}

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

              {step.actions && (
                <ol className="flex flex-col gap-6">
                  {step.actions.map((action, ai) => (
                    <li key={ai} className="flex gap-3 sm:gap-4">
                      <span className="text-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 text-xs font-bold tabular-nums">
                        {ai + 1}
                      </span>
                      <div className="flex flex-1 flex-col gap-2">
                        {action.label && (
                          <p className="text-sm text-gray-300 sm:text-base">
                            {action.label}
                          </p>
                        )}
                        {action.note && (
                          <p className="text-xs italic text-gray-500 sm:text-sm">
                            {action.note}
                          </p>
                        )}
                        <div className="mt-1 flex flex-col gap-2">
                          {action.prompts.map((p, pi) => (
                            <CopyablePrompt key={pi} text={p} />
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
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
        <div
          ref={headerRef}
          className="mb-12 flex flex-col items-center text-center"
        >
          <WordsPullUpMultiStyle
            className="text-2xl font-normal sm:text-3xl md:text-4xl lg:text-5xl"
            segments={[
              { text: 'The Alpha Method.', className: '' },
              {
                text: 'Seven steps from outcome to collaborators.',
                className: 'text-gray-500',
              },
            ]}
          />
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            The Scoping Protocol works because researchers spend 4 months
            manually validating each assumption, meeting experts from industry,
            academia and investors. The Alpha Method is AI-accelerated so that
            you have an invention worth months of research and prototyping. The
            Scoping Protocol can move in any direction, branching from any
            approach. The Alpha Method forces you to start broad and move through
            a fixed number of steps. Let's begin with Alpha.
          </p>
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

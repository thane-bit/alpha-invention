import { motion } from 'framer-motion'
import WordsPullUp from './WordsPullUp'
import { GeminiIcon, ClaudeIcon, OpenAIIcon } from './BrandIcons'
import { GEMINI_URL, CLAUDE_URL, OPENAI_URL, DSV_HOME_URL } from '../links'
import dsvMark from '../assets/dsv-mark.png'

// Chat assistants surfaced as icon links inside the "Start scoping" pill.
const SCOPING_TOOLS: {
  name: string
  href: string
  Icon: (props: { className?: string }) => JSX.Element
}[] = [
  { name: 'Gemini', href: GEMINI_URL, Icon: GeminiIcon },
  { name: 'Claude', href: CLAUDE_URL, Icon: ClaudeIcon },
  { name: 'ChatGPT', href: OPENAI_URL, Icon: OpenAIIcon },
]

// "About" scrolls to the first content section; "Invent" to the 7-step
// protocol; the DSV mark links out to the Deep Science Ventures homepage.
const NAV_ITEMS: {
  n?: string
  label: string
  href: string
  external?: boolean
  img?: string
}[] = [
  { label: 'About', href: '#about' },
  { label: 'Invent', href: '#protocol' },
  {
    label: 'Deep Science Ventures',
    href: DSV_HOME_URL,
    external: true,
    img: dsvMark,
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section className="h-screen w-full p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />

        {/* Noise + gradient overlays */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Navbar — black pill hanging from the top edge (scrolls on overflow) */}
        <nav className="absolute left-1/2 top-0 z-20 max-w-[94vw] -translate-x-1/2">
          <ul className="no-scrollbar flex items-center gap-3 overflow-x-auto rounded-b-2xl bg-black px-4 py-2 sm:gap-6 md:gap-10 md:rounded-b-3xl md:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.img ? (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    aria-label={item.label}
                    title={item.label}
                    className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20 transition-transform duration-200 hover:scale-110 sm:h-7 sm:w-7"
                  >
                    <img
                      src={item.img}
                      alt={item.label}
                      className="h-full w-full object-cover"
                    />
                  </a>
                ) : (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="flex items-baseline gap-1 whitespace-nowrap text-[10px] transition-colors duration-200 sm:text-xs md:text-sm"
                    style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = '#E1E0CC')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')
                    }
                  >
                    {item.n && (
                      <span className="text-primary text-[0.7em] font-bold tabular-nums">
                        {item.n}
                      </span>
                    )}
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Hero content — bottom aligned */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 sm:px-6 md:px-8 md:pb-6">
          <div className="grid grid-cols-12 items-end gap-4">
            {/* Giant heading */}
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                style={{ color: '#E1E0CC' }}
              >
                <WordsPullUp text="Alpha" showAsterisk />
              </h1>
            </div>

            {/* Right column — description + CTA */}
            <div className="col-span-12 flex flex-col gap-5 pb-2 lg:col-span-4">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                className="text-primary/70 text-xs sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
              >
                An agentic workflow to dismantle the hardest global challenges.
                Build logical chains to surface structural bottlenecks and
                master regulators.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                className="flex w-fit items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black sm:text-base"
              >
                Start scoping
                <div className="flex items-center gap-1.5">
                  {SCOPING_TOOLS.map(({ name, href, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${name}`}
                      title={name}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-200 hover:scale-110 sm:h-10 sm:w-10"
                      style={{ color: '#E1E0CC' }}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

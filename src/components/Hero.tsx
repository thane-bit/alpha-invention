import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import WordsPullUp from './WordsPullUp'
import { DOC_URL } from '../links'

const NAV_ITEMS = ['Outcome', 'Requirements', 'Scope', 'Triage', 'Collaborators']

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

        {/* Navbar — black pill hanging from the top edge */}
        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <ul className="flex items-center gap-3 rounded-b-2xl bg-black px-4 py-2 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href={DOC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] transition-colors duration-200 sm:text-xs md:text-sm"
                  style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#E1E0CC')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')
                  }
                >
                  {item}
                </a>
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
                Alpha is a venture-science method for systematic invention — a
                worldwide protocol that decomposes the hardest global challenges
                into recursive solution–constraint chains, surfacing the
                structural bottlenecks and master regulators others miss.
              </motion.p>

              <motion.a
                href={DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                className="group flex w-fit items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all duration-300 hover:gap-3 sm:text-base"
              >
                Start scoping
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

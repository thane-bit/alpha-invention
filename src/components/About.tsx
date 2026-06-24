import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import AnimatedLetter from './AnimatedLetter'

const BODY_TEXT =
  'Across hundreds of scoping runs, Alpha pairs adversarial agents that argue every claim, building a comprehensive blueprint of intervention pathways. Together they map the structural bottlenecks, rank approaches on upside, neglect and traction, and convert raw insight into a fundable product specification.'

export default function About() {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = BODY_TEXT.split('')

  return (
    <section className="bg-black px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center rounded-2xl bg-[#101010] px-6 py-20 text-center sm:px-12 md:rounded-[2rem] md:py-28">
        {/* Small label */}
        <span className="text-primary mb-8 text-[10px] uppercase tracking-[0.3em] sm:text-xs">
          Set an Outcome, Copy these Prompts
        </span>

        {/* Multi-style heading */}
        <WordsPullUpMultiStyle
          className="mx-auto w-full max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          segments={[
            { text: 'Inventions change our world.', className: 'font-normal' },
            {
              text: 'Determine the outcome you want to see in the world,',
              className: 'italic font-serif',
            },
            {
              text: 'explore and rank hundreds of inventions that could get us there and build the optimal one.',
              className: 'font-normal',
            },
          ]}
        />

        {/* Scroll-linked character reveal */}
        <p
          ref={paragraphRef}
          className="mx-auto mt-12 w-full max-w-3xl break-words text-xs sm:text-sm md:text-base md:mt-16"
          style={{ color: '#DEDBC8', lineHeight: 1.7 }}
        >
          {chars.map((char, i) => (
            <AnimatedLetter
              key={i}
              char={char}
              index={i}
              totalChars={chars.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import AnimatedLetter from './AnimatedLetter'
import { DSV_HOME_URL, VSD_URL } from '../links'

// First occurrence of each phrase in the body becomes a link to its page.
const PHRASE_LINKS: { phrase: string; href: string }[] = [
  { phrase: 'Deep Science Ventures', href: DSV_HOME_URL },
  { phrase: 'Venture Science Doctorate', href: VSD_URL },
]

// Brief lineage: Deep Science Ventures first, then the Venture Science
// Doctorate — the two foundations Alpha grew out of.
const BODY_TEXT =
  'Deep Science Ventures is a venture creator that pairs founder-type scientists with deep domain expertise to build high-impact companies across climate, computation, agriculture and pharma — reasoning backwards from the outcome the world needs. To date it has launched 58 companies, attracted $240M in funding and built a portfolio valued at $700M. The Venture Science Doctorate is its reinvention of the PhD: a three-year, fully-funded programme that trains Venture Scientists to design their own research from first principles and launch breakthrough deep-tech ventures, with 14 Venture Scientists currently in training. Alpha turns that same doctrine into an agentic workflow anyone can run.'

export default function Origins() {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const totalChars = BODY_TEXT.length
  // Split into words so each word stays on one line; track a running character
  // index so the scroll-linked reveal still animates letter-by-letter.
  const words = BODY_TEXT.split(' ')
  let charIndex = 0

  // Map each word index to an href if it falls inside the first occurrence of a
  // linked phrase, so those words render as a link without breaking the reveal.
  const linkForWord: (string | null)[] = words.map(() => null)
  for (const { phrase, href } of PHRASE_LINKS) {
    const phraseWords = phrase.split(' ')
    for (let start = 0; start + phraseWords.length <= words.length; start++) {
      const matches = phraseWords.every((pw, k) => words[start + k] === pw)
      if (matches && linkForWord[start] === null) {
        for (let k = 0; k < phraseWords.length; k++) linkForWord[start + k] = href
        break // first occurrence only
      }
    }
  }

  return (
    <section
      id="origins"
      className="scroll-mt-20 bg-black px-4 py-24 sm:px-6 md:py-32"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center rounded-2xl bg-[#101010] px-6 py-20 text-center sm:px-12 md:rounded-[2rem] md:py-28">
        {/* Small label */}
        <span className="text-primary mb-8 text-[10px] uppercase tracking-[0.3em] sm:text-xs">
          Before Alpha there was DSV
        </span>

        {/* Multi-style heading */}
        <WordsPullUpMultiStyle
          className="mx-auto w-full max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          segments={[
            { text: 'Origin stories.', className: 'font-normal' },
            {
              text: 'Deep Science Ventures builds companies from scientific first principles,',
              className: 'italic font-serif',
            },
            {
              text: 'the Venture Science Doctorate trains the founder-scientists who invent them.',
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
          {words.map((word, wi) => {
            const href = linkForWord[wi]
            const letters = (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split('').map((char) => {
                  const i = charIndex++
                  return (
                    <AnimatedLetter
                      key={i}
                      char={char}
                      index={i}
                      totalChars={totalChars}
                      progress={scrollYProgress}
                    />
                  )
                })}
              </span>
            )
            // Render the space that separated this word from the next as its
            // own animated character so the reveal timing stays continuous.
            const space =
              wi < words.length - 1 ? (
                <AnimatedLetter
                  key={`s${wi}`}
                  char=" "
                  index={charIndex++}
                  totalChars={totalChars}
                  progress={scrollYProgress}
                />
              ) : null

            // Keep the space inside the link only when the next word shares it,
            // so multi-word phrases read as one continuous underlined link.
            const nextSharesLink =
              href !== null && wi < words.length - 1 && linkForWord[wi + 1] === href

            if (href) {
              return (
                <span key={`w${wi}`}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-2 underline-offset-2 transition-opacity hover:opacity-80"
                    style={{ color: '#FBFAF2' }}
                  >
                    {letters}
                    {nextSharesLink ? space : null}
                  </a>
                  {nextSharesLink ? null : space}
                </span>
              )
            }
            return (
              <span key={`w${wi}`}>
                {letters}
                {space}
              </span>
            )
          })}
        </p>
      </div>
    </section>
  )
}

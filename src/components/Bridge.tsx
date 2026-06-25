import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'

/**
 * Short transitional pull-quote between the DSV/VSD origins and the Alpha
 * intro: the counterpoint that motivates Alpha — the VSD can't take everyone,
 * so the tools of invention have to be democratized.
 */
export default function Bridge() {
  return (
    <section className="bg-black px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <WordsPullUpMultiStyle
          className="mx-auto w-full max-w-3xl text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-5xl"
          segments={[
            {
              text: 'But the Venture Science Doctorate cannot enrol everyone who applies —',
              className: 'font-normal',
            },
            {
              text: "it's never been more important to democratize tools for invention.",
              className: 'italic font-serif',
            },
          ]}
        />
      </div>
    </section>
  )
}

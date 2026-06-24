import { Fragment, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export interface Segment {
  text: string
  className?: string
  /** Force this segment onto a new line (a full-width flex break before it). */
  breakBefore?: boolean
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[]
  className?: string
}

/**
 * Takes an array of {text, className} segments, splits all into individual
 * words while preserving each segment's per-word className, then runs the same
 * staggered pull-up animation across the whole sequence.
 */
export default function WordsPullUpMultiStyle({
  segments,
  className = '',
}: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  // Render segment by segment so a segment can force a line break before it,
  // while keeping a single running index for the staggered animation.
  let wordIndex = 0

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {segments.map((segment, si) => (
        <Fragment key={si}>
          {segment.breakBefore && (
            <div className="h-0 basis-full" aria-hidden="true" />
          )}
          {segment.text
            .split(' ')
            .filter(Boolean)
            .map((word) => {
              const i = wordIndex++
              return (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block ${segment.className ?? ''}`}
                  style={{ marginRight: '0.22em' }}
                >
                  {word}
                </motion.span>
              )
            })}
        </Fragment>
      ))}
    </div>
  )
}

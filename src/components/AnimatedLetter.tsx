import { motion, useTransform, type MotionValue } from 'framer-motion'

interface AnimatedLetterProps {
  char: string
  index: number
  totalChars: number
  progress: MotionValue<number>
}

/**
 * A single character whose opacity is driven by scroll progress, producing a
 * progressive left-to-right text reveal as the paragraph scrolls through view.
 */
export default function AnimatedLetter({
  char,
  index,
  totalChars,
  progress,
}: AnimatedLetterProps) {
  const charProgress = index / totalChars
  const opacity = useTransform(
    progress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1],
  )

  return (
    <motion.span style={{ opacity }}>
      {char === ' ' ? ' ' : char}
    </motion.span>
  )
}

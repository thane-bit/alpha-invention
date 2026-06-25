import { useRef, useState, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Send, AlertCircle } from 'lucide-react'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import { FORMSPREE_ENDPOINT, FORMSPREE_FORM_ID } from '../links'

const EASE = [0.22, 1, 0.36, 1] as const

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Comments() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true, margin: '-100px' })
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  // True until a real Formspree form ID is pasted into links.ts.
  const isConfigured = (FORMSPREE_FORM_ID as string) !== 'YOUR_FORM_ID'

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isConfigured) return

    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    setError(null)
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        const body = await res.json().catch(() => null)
        setError(
          body?.errors?.[0]?.message ??
            'Something went wrong sending your comment. Please try again.',
        )
        setStatus('error')
      }
    } catch {
      setError('Network error — please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <section id="comments" className="bg-black px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-2xl">
        <div
          ref={headerRef}
          className="mb-12 flex flex-col items-center text-center"
        >
          <WordsPullUpMultiStyle
            className="text-2xl font-normal sm:text-3xl md:text-4xl lg:text-5xl"
            segments={[
              { text: 'Leave a comment.', className: '' },
              {
                text: 'Questions, ideas, what you invented.',
                className: 'text-gray-500',
              },
            ]}
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-7"
        >
          {status === 'sent' ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 text-primary">
                <Check className="h-6 w-6" />
              </span>
              <p
                className="text-base font-bold sm:text-lg"
                style={{ color: '#E1E0CC' }}
              >
                Thanks — your comment is on its way.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-primary text-sm underline underline-offset-2 hover:opacity-80"
              >
                Leave another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    className="rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-primary/50 sm:text-base"
                    placeholder="Optional"
                  />
                </label>
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-primary/50 sm:text-base"
                    placeholder="So I can reply (optional)"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Comment
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="resize-y rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-primary/50 sm:text-base"
                  placeholder="What's on your mind?"
                />
              </label>

              {status === 'error' && error && (
                <p className="flex items-start gap-2 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {error}
                </p>
              )}

              {!isConfigured && (
                <p className="flex items-start gap-2 text-xs text-gray-500 sm:text-sm">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  Comments aren't connected yet — add a Formspree form ID in{' '}
                  <code className="text-gray-400">src/links.ts</code> to go live.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !isConfigured}
                className="mt-1 flex items-center justify-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-medium text-black transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                <Send className="h-4 w-4" />
                {status === 'sending' ? 'Sending…' : 'Send comment'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

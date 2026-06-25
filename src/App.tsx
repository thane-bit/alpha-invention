import Hero from './components/Hero'
import Origins from './components/Origins'
import About from './components/About'
import Features from './components/Features'
import Protocol from './components/Protocol'
import Comments from './components/Comments'

export default function App() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <Origins />
      <About />
      <Features />
      <Protocol />
      <Comments />
    </main>
  )
}

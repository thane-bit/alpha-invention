import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Protocol from './components/Protocol'

export default function App() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <About />
      <Features />
      <Protocol />
    </main>
  )
}

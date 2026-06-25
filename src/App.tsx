import Hero from './components/Hero'
import Origins from './components/Origins'
import Bridge from './components/Bridge'
import About from './components/About'
import Features from './components/Features'
import Protocol from './components/Protocol'
import Comments from './components/Comments'

export default function App() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <Origins />
      <Bridge />
      <About />
      <Features />
      <Protocol />
      <Comments />
    </main>
  )
}

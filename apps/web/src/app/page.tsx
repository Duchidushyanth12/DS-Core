import Link from 'next/link';
import { ArrowRight, Code2, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <header className="glass fixed top-0 w-full z-50 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">DS-corE</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/problems" className="hover:text-foreground transition-colors">Problems</Link>
          <Link href="/patterns" className="hover:text-foreground transition-colors">Patterns</Link>
          <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
          <div className="h-4 w-px bg-border mx-2" />
          <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Get Started</Link>
        </nav>
      </header>

      <main className="pt-32 pb-16 px-8 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Client Services Module Live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          Master Data Structures & <br />
          <span className="gradient-text">Algorithms by Pattern</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Stop memorizing solutions. Learn the underlying patterns that solve thousands of problems. Build your problem-solving intuition with our guided paths and real-time execution engine.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/problems" className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-transform hover:scale-105">
            Start Practicing <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/client" className="flex items-center gap-2 glass px-8 py-4 rounded-full font-semibold hover:bg-card/80 transition-transform hover:scale-105">
            For Organizations
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full text-left">
          <div className="glass-card p-6">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Layers className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Structured Learning</h3>
            <p className="text-muted-foreground">Curated paths categorized by patterns like Sliding Window, Two Pointers, and DP.</p>
          </div>
          <div className="glass-card p-6">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Execution</h3>
            <p className="text-muted-foreground">Secure, lightning-fast code execution in multiple languages via our cloud engine.</p>
          </div>
          <div className="glass-card p-6">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="text-green-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Client Services</h3>
            <p className="text-muted-foreground">Powerful dashboards for institutes to assign tests, monitor progress, and assess talent.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

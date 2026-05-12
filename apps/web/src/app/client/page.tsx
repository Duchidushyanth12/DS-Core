import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ChartNoAxesColumn,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Users,
} from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Cohort-Based Assessments',
    description:
      'Create structured test tracks for students, campus drives, and internal hiring loops.',
  },
  {
    icon: ChartNoAxesColumn,
    title: 'Progress Visibility',
    description:
      'Review completion trends, weak patterns, and ranking changes from one clean dashboard.',
  },
  {
    icon: ShieldCheck,
    title: 'Controlled Evaluations',
    description:
      'Run timed coding rounds with a guided practice path and a monitored execution flow.',
  },
];

const highlights = [
  'Assign problem sets by pattern and difficulty',
  'Track submissions and leaderboard movement',
  'Use the same learning flow for practice and screening',
  'Start with a focused pilot before scaling to larger groups',
];

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-[-12%] left-[-8%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-12%] right-[-8%] h-[28rem] w-[28rem] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />

      <header className="glass fixed top-0 left-0 z-50 flex w-full items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">DS-corE</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/problems" className="hover:text-foreground transition-colors">
            Problems
          </Link>
          <Link href="/patterns" className="hover:text-foreground transition-colors">
            Patterns
          </Link>
          <Link href="/leaderboard" className="hover:text-foreground transition-colors">
            Leaderboard
          </Link>
          <Link href="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Request Access
          </Link>
        </nav>
      </header>

      <main className="px-8 pb-16 pt-32">
        <section className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
              <Building2 className="h-4 w-4" />
              Organization Workspace Preview
            </div>

            <h1 className="max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">
              Run structured DSA practice for teams, institutes, and hiring programs.
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              DS-corE can be used beyond individual prep. Create guided tracks, monitor
              performance, and turn problem-solving into a measurable training system.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-full bg-foreground px-7 py-4 font-semibold text-background transition-transform hover:scale-105 hover:bg-gray-200"
              >
                Start a Pilot <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/patterns"
                className="glass rounded-full px-7 py-4 font-semibold transition-colors hover:bg-card/80"
              >
                Explore the Learning Model
              </Link>
            </div>
          </div>

          <div className="glass-card p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              What Teams Get
            </p>
            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 grid max-w-6xl gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="glass-card p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mb-3 text-xl font-bold">{benefit.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

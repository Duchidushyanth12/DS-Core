'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import { 
  Code2, 
  Layers, 
  Hash, 
  ArrowUpDown, 
  Search as SearchIcon, 
  GitMerge, 
  Monitor, 
  Cpu, 
  Activity,
  List,
  GitBranch,
  Database,
  Grid,
  Zap,
  ChevronRight,
  TrendingUp,
  Lock,
  CheckCircle2
} from 'lucide-react';

const domainIcons: Record<string, any> = {
  "Arrays": Grid,
  "Strings": Hash,
  "Hashing": Layers,
  "Sorting": ArrowUpDown,
  "Searching": SearchIcon,
  "Two Pointers": Activity,
  "Sliding Window": Monitor,
  "Stack": Layers,
  "Queue": List,
  "Linked List": GitMerge,
  "Recursion": Zap,
  "Backtracking": GitBranch,
  "Trees": GitBranch,
  "Binary Search Tree": GitBranch,
  "Heap / Priority Queue": TrendingUp,
  "Graphs": GitMerge,
  "Dynamic Programming": Cpu,
  "Greedy Algorithms": TrendingUp,
  "Bit Manipulation": Cpu,
  "Math": Code2,
  "Matrix": Grid,
  "Trie": GitBranch,
  "Union Find": GitMerge,
  "Segment Tree": Database,
  "System Design": Monitor
};

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPatterns() {
      try {
        const response = await fetch(`${API_URL}/api/patterns`);
        if (!response.ok) throw new Error("API unreachable");
        const data = await response.json();
        setPatterns(Array.isArray(data) ? data : []);
      } catch {
        setPatterns([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPatterns();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <header className="glass fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">DS-corE</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/problems" className="text-sm font-medium hover:text-primary transition-colors">Problems</Link>
          <Link href="/patterns" className="text-sm font-medium text-primary">Patterns</Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">Leaderboard</Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3 h-3" /> Sequential Learning Active
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
            Pattern Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Our strict sequential system ensures you master the basics before moving to advanced topics. Complete each pattern to unlock the next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="glass-card h-64 animate-pulse" />
            ))
          ) : (
            patterns.map((pattern) => {
              const Icon = domainIcons[pattern.name] || Code2;
              const completedCount = pattern.userProgress?.completedProblems || 0;
              const totalCount = pattern.totalProblems || 35;
              const progress = (completedCount / totalCount) * 100;
              const isUnlocked = pattern.isUnlocked;
              
              const CardContent = (
                <div className={`group relative glass-card p-6 transition-all duration-500 flex flex-col h-full ${
                  isUnlocked ? 'hover:border-primary/40 hover:-translate-y-1' : 'opacity-60 cursor-not-allowed grayscale'
                }`}>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl">
                      <div className="p-4 rounded-full bg-background/80 border border-white/10 shadow-2xl mb-3">
                        <Lock className="w-8 h-8 text-white/40" />
                      </div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Locked Track</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl transition-all duration-500 ${
                      isUnlocked 
                        ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white shadow-lg shadow-primary/5' 
                        : 'bg-white/5 text-white/20'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    {pattern.userProgress?.isCompleted && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-black mb-2 transition-colors ${
                    isUnlocked ? 'group-hover:text-primary' : 'text-white/20'
                  }`}>
                    {pattern.orderIndex}. {pattern.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-8 line-clamp-2">{pattern.description}</p>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-muted-foreground/60">
                      <span>{isUnlocked ? 'Mastery Progress' : 'Status: Locked'}</span>
                      <span>{completedCount} / {totalCount}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          pattern.userProgress?.isCompleted ? 'bg-green-500' : 'bg-primary'
                        }`} 
                        style={{ width: `${isUnlocked ? progress : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {isUnlocked && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
              );

              return isUnlocked ? (
                <Link key={pattern.id} href={`/problems?patternId=${pattern.id}`}>
                  {CardContent}
                </Link>
              ) : (
                <div key={pattern.id}>{CardContent}</div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

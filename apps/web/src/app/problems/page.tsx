'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Code2, ChevronRight, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/api';

function ProblemsContent() {
  const searchParams = useSearchParams();
  const patternId = searchParams.get('patternId');
  
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProblems() {
      setIsLoading(true);
      try {
        const url = patternId 
          ? `${API_URL}/api/problems?patternId=${patternId}`
          : `${API_URL}/api/problems`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("API Unreachable");
        const data = await response.json();
        setProblems(Array.isArray(data) ? data : []);
      } catch {
        setProblems([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProblems();
  }, [patternId]);


  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pattern?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {patternId ? 'Pattern Problems' : 'All Challenges'}
          </h1>
          <p className="text-muted-foreground">Master algorithmic patterns by solving curated problems.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search problems..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary border border-border rounded-md py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {patternId && (
            <Link href="/problems" className="glass flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors text-sm">
              Show All
            </Link>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading problem set...</p>
          </div>
        ) : filteredProblems.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Pattern</th>
                <th className="p-4 font-semibold">Difficulty</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <Link href={`/problems/${problem.slug}`} className="font-medium group-hover:text-primary transition-colors">
                      {problem.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">
                      {problem.pattern?.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold ${
                      problem.difficulty === 'EASY' ? 'text-green-400' :
                      problem.difficulty === 'MEDIUM' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/problems/${problem.slug}`} className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm">
                      Solve <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white/5 p-6 rounded-full mb-4">
              <Code2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No problems found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <header className="glass fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">DS-corE</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/problems" className="text-sm font-medium text-primary">Problems</Link>
          <Link href="/patterns" className="text-sm font-medium hover:text-primary transition-colors">Patterns</Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">Leaderboard</Link>
        </nav>
      </header>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      }>
        <ProblemsContent />
      </Suspense>
    </div>
  );
}

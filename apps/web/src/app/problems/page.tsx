'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Logo from '@/components/Logo';

function ProblemsContent() {
  const searchParams = useSearchParams();
  const patternId = searchParams.get('patternId');
  
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const itemsPerPage = 50;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchProblems() {
      setIsLoading(true);
      try {
        const url = new URL(`${API_URL}/api/problems`);
        if (patternId) url.searchParams.append('patternId', patternId);
        if (userId) url.searchParams.append('userId', userId);

        const response = await fetch(url.toString());
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
  }, [patternId, userId]);

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.pattern?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'ALL' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const currentProblems = filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, difficultyFilter, patternId]);

  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {patternId ? 'Pattern Problems' : 'All Challenges'}
          </h1>
          <p className="text-muted-foreground">Master algorithmic patterns by solving curated problems.</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-secondary border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
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

      <div className="glass-card overflow-hidden mb-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading problem set...</p>
          </div>
        ) : currentProblems.length > 0 ? (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-semibold w-12">Status</th>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Pattern</th>
                  <th className="p-4 font-semibold">Difficulty</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProblems.map((problem) => (
                  <tr key={problem.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      {problem.isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-border" />
                      )}
                    </td>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4">
              <Logo size={80} showText={false} />
            </div>
            <h3 className="text-xl font-bold mb-2">No problems found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-16">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="glass px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                    currentPage === pageNum ? 'bg-primary text-white font-bold' : 'glass hover:bg-secondary'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="glass px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-background p-8 pt-24">
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

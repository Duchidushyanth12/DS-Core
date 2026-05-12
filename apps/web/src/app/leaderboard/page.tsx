'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, Trophy, Medal, Crown, Loader2, Search, Users } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(`${API_URL}/api/leaderboard`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <header className="glass fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">DS-corE</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/problems" className="text-sm font-medium hover:text-primary transition-colors">Problems</Link>
          <Link href="/patterns" className="text-sm font-medium hover:text-primary transition-colors">Patterns</Link>
          <Link href="/leaderboard" className="text-sm font-medium text-primary">Leaderboard</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4">Global Leaderboard</h1>
          <p className="text-xl text-muted-foreground">The best of the best. Solve problems to climb the ranks.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Calculating rankings...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center text-center gap-6">
            <div className="bg-white/5 p-8 rounded-full">
              <Users className="w-16 h-16 text-muted-foreground/40" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">No Rankings Yet</h2>
              <p className="text-muted-foreground max-w-md">
                {searchTerm 
                  ? `No users found matching "${searchTerm}".`
                  : 'Be the first to solve problems and claim the top spot on the leaderboard!'}
              </p>
            </div>
            {!searchTerm && (
              <Link href="/patterns" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                Start Solving →
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {filteredUsers.slice(0, 3).map((user, i) => (
                <div
                  key={user.id}
                  className={`glass-card p-8 text-center relative overflow-hidden ${
                    i === 0 ? 'border-yellow-500/50 -translate-y-4 shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)]' :
                    i === 1 ? 'border-slate-400/50' : 'border-amber-700/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-black text-primary mx-auto mb-4">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{user.username}</h3>
                  <div className="text-sm text-muted-foreground mb-4">{user.solved} Problems Solved</div>
                  <div className="text-2xl font-black text-primary">{user.points.toLocaleString()} pts</div>
                  <div className="absolute top-4 right-4">
                    {i === 0 ? <Crown className="w-6 h-6 text-yellow-500" /> :
                     i === 1 ? <Medal className="w-6 h-6 text-slate-400" /> :
                     <Medal className="w-6 h-6 text-amber-700" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Rankings Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="font-bold">Full Rankings</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Find a user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-md py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-white/5">
                    <th className="p-6">Rank</th>
                    <th className="p-6">User</th>
                    <th className="p-6">Solved</th>
                    <th className="p-6 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                      <td className="p-6 font-mono text-muted-foreground">#{user.rank}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold">{user.username}</span>
                        </div>
                      </td>
                      <td className="p-6 text-muted-foreground">{user.solved}</td>
                      <td className="p-6 text-right font-black text-primary">{user.points.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

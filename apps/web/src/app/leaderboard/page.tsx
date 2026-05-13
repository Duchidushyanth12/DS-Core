'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, Trophy, Medal, Crown, Loader2, Search, Users } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const url = new URL(`${API_URL}/api/leaderboard`);
        if (userId) url.searchParams.append('userId', userId);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setUsers(Array.isArray(data.rankings) ? data.rankings : []);
        setMyRank(data.myRank);
      } catch (error) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaderboard();
  }, [userId]);

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
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

            {/* My Rank Sticky Bar */}
            {myRank && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-40">
                <div className="glass bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full p-4 flex items-center justify-between shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                      #{myRank.rank}
                    </div>
                    <div>
                      <div className="text-xs uppercase font-black text-primary/80">Your Rank</div>
                      <div className="font-bold text-white">{myRank.username}</div>
                    </div>
                  </div>
                  <div className="flex gap-8 px-6">
                    <div className="text-center">
                      <div className="text-xs uppercase font-black text-primary/80">Solved</div>
                      <div className="font-bold text-white">{myRank.solved}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase font-black text-primary/80">Points</div>
                      <div className="font-bold text-white">{myRank.points.toLocaleString()}</div>
                    </div>
                  </div>
                  <Link href="/patterns" className="bg-primary text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
                    CLIMB HIGHER
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

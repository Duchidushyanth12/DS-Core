'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { API_URL } from '@/lib/api';
import { 
  Code2, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Loader2,
  Calendar,
  Star,
  Layers
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchStats(authUser.uid);
      } else {
        // Redirect or show guest state
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  async function fetchStats(uid: string) {
    try {
      // For now we use the leaderboard API logic to get user stats
      const response = await fetch(`${API_URL}/api/leaderboard?userId=${uid}`);
      const data = await response.json();
      setStats(data.myRank);
    } catch (err) {
      console.error("Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return (
    <div className="h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
    </div>
  );

  if (!user) return (
    <div className="h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Please sign in to view your dashboard</h2>
      <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-full font-bold">
        Sign In
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <h1 className="text-5xl font-black mb-2">Welcome back, {user.displayName || 'Coder'}!</h1>
            <p className="text-xl text-muted-foreground">Keep the momentum going. You're doing great.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-4 flex flex-col items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-500 mb-1" />
              <span className="text-2xl font-black">5</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Day Streak</span>
            </div>
            <div className="glass-card px-6 py-4 flex flex-col items-center justify-center border-primary/30">
              <Star className="w-6 h-6 text-primary mb-1" />
              <span className="text-2xl font-black">Level 4</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Expert</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 border-b-4 border-b-green-500/50">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest">+2 Today</span>
            </div>
            <h3 className="text-3xl font-black mb-1">{stats?.solved || 0}</h3>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
          </div>

          <div className="glass-card p-6 border-b-4 border-b-blue-500/50">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black mb-1">{stats?.points || 0}</h3>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>

          <div className="glass-card p-6 border-b-4 border-b-purple-500/50">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black mb-1">12h</h3>
            <p className="text-sm text-muted-foreground">Practice Time</p>
          </div>

          <div className="glass-card p-6 border-b-4 border-b-yellow-500/50">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black mb-1">Top 5%</h3>
            <p className="text-sm text-muted-foreground">Global Ranking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Learning Path */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" /> Continue Learning
            </h2>
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors" />
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Layers className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black mb-2">Arrays & Hashing</h3>
                  <p className="text-muted-foreground mb-6">You're 80% through this track. Solve 7 more problems to unlock "Strings".</p>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/5">
                    <div className="h-full bg-primary w-[80%]" />
                  </div>
                  <Link href="/patterns" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                    Continue Path <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-muted-foreground" /> Recent Activity
            </h2>
            <div className="glass-card divide-y divide-white/5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">Two Sum</span>
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Accepted</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Arrays & Hashing</span>
                    <span>2h ago</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/leaderboard" className="mt-4 block text-center text-sm font-bold text-primary hover:underline">
              View full activity log
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

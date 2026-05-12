'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Code2, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { auth, googleProvider, githubProvider, signInWithPopup } from '@/lib/firebase';
import { API_URL } from '@/lib/api';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const handleSocialLogin = async (provider: any) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sync user with backend (non-blocking)
      fetch(`${API_URL}/api/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          photoURL: user.photoURL
        })
      }).catch(() => {}); // Silently ignore backend sync errors

      router.push('/patterns');
    } catch (error: any) {
      const demoErrors = ['api-key-not-valid', 'invalid-api-key', 'network-request-failed', 'popup-closed-by-user', 'cancelled-popup-request'];
      if (demoErrors.some(code => error?.code?.includes(code))) {
        router.push('/patterns');
      } else {
        setAuthError('Sign up failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setTimeout(() => {
      router.push('/patterns');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <header className="fixed top-0 w-full p-8">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">DS-corE</span>
        </Link>
      </header>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-center justify-center">
        {/* Left: Info Card */}
        <div className="hidden md:flex flex-col justify-center space-y-8 p-8 flex-1">
          <h2 className="text-5xl font-black leading-tight">Start your journey to <span className="text-primary">Mastery</span> today.</h2>
          <ul className="space-y-6">
            {[
              "Access 500+ premium problems",
              "Structured learning paths",
              "Real-time code execution",
              "Global leaderboard ranking"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-4 text-muted-foreground text-lg font-medium">
                <CheckCircle2 className="w-6 h-6 text-green-500" /> {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Signup Form */}
        <div className="w-full max-w-md">
          <div className="glass-card p-8 space-y-8 relative overflow-hidden">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold mb-2">Get Started</h1>
              <p className="text-muted-foreground">Create your free account in seconds.</p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-secondary border border-border rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full bg-secondary border border-border rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-secondary border border-border rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-bold">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSocialLogin(githubProvider)}
                disabled={isLoading}
                className="glass py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-colors font-medium disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </button>
              <button 
                onClick={() => handleSocialLogin(googleProvider)}
                disabled={isLoading}
                className="glass py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-colors font-medium disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

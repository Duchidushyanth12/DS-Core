'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Image from 'next/image';
import Logo from './Logo';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.removeItem('manual-logout');
      } else if (process.env.NODE_ENV === 'development' && localStorage.getItem('manual-logout') !== 'true') {
        // Local dev bypass: use mock user if no real user and not manually logged out
        setUser({ 
          uid: 'local-test-user', 
          email: 'test@example.com', 
          displayName: 'Test User' 
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('manual-logout', 'true');
    }
    signOut(auth);
    setUser(null);
  };

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/problems/')) return null;

  const navLinks = [
    { name: 'Problems', href: '/problems' },
    { name: 'Patterns', href: '/patterns' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <header className="glass fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-3">
      <div className="flex items-center gap-8">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size={42} />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? 'text-primary' : 'text-muted-foreground hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                pathname === '/dashboard' ? 'bg-primary text-white' : 'glass hover:bg-secondary'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="h-8 w-px bg-white/10" />
            <button 
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-red-400 p-2 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <Link 
              href="/profile"
              className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer overflow-hidden"
              title="View Profile"
            >
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt="Profile" 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'
              )}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

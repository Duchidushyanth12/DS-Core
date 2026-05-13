'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { API_URL } from '@/lib/api';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Edit2, 
  Check, 
  X, 
  Loader2,
  Trophy,
  History,
  TrendingUp,
  MapPin,
  Globe,
  Link2
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    photoURL: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchProfile();
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        }
      });
      const data = await response.json();
      setProfile(data);
      setFormData({
        username: data.username || '',
        bio: data.bio || '',
        githubUrl: data.githubUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        photoURL: data.photoURL || ''
      });
    } catch (err) {
      console.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return (
    <div className="h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Fetching your profile...</p>
    </div>
  );

  if (!user) return (
    <div className="h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Please sign in to view your profile</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8 pt-24 pb-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Personal Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-8 text-center flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-4xl font-bold text-primary overflow-hidden">
                {formData.photoURL ? (
                  <img src={formData.photoURL} alt={formData.username} className="w-full h-full object-cover" />
                ) : (
                  formData.username?.charAt(0) || user.email?.charAt(0).toUpperCase()
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="w-full space-y-4">
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-center text-lg font-bold outline-none focus:border-primary"
                  placeholder="Username"
                />
                <textarea 
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-muted-foreground outline-none focus:border-primary min-h-[100px]"
                  placeholder="Short bio..."
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black mb-2">{profile?.username || 'Coder'}</h2>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {profile?.bio || "No bio yet. Tell the community about yourself!"}
                </p>
              </>
            )}

            <div className="w-full h-px bg-white/10 my-6" />

            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              
              <div className="flex gap-4 pt-4 justify-center">
                {isEditing ? (
                  <>
                    <input 
                      type="text" 
                      value={formData.githubUrl} 
                      placeholder="GitHub URL"
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      className="text-xs bg-white/5 border border-white/10 rounded p-1 w-full"
                    />
                    <input 
                      type="text" 
                      value={formData.linkedinUrl} 
                      placeholder="LinkedIn URL"
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      className="text-xs bg-white/5 border border-white/10 rounded p-1 w-full"
                    />
                  </>
                ) : (
                  <>
                    {profile?.githubUrl && (
                      <a href={profile.githubUrl} target="_blank" className="p-2 glass hover:bg-white/10 rounded-lg transition-colors">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a href={profile.linkedinUrl} target="_blank" className="p-2 glass hover:bg-white/10 rounded-lg transition-colors">
                        <Link2 className="w-5 h-5 text-blue-400" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 w-full">
              {isEditing ? (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-primary text-white py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 glass hover:bg-red-500/20 text-red-400 rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full glass py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Badges
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg" title="Pattern Master">🎓</div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg" title="Problem Solver">⚡</div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg" title="Quick Learner">🔥</div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & History */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-6 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Solved</span>
              <span className="text-3xl font-black text-white">{profile?.submissions?.filter((s:any) => s.status === 'ACCEPTED').length || 0}</span>
              <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[45%]" />
              </div>
            </div>
            <div className="glass-card p-6 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Accuracy</span>
              <span className="text-3xl font-black text-white">
                {profile?.submissions?.length 
                  ? Math.round((profile.submissions.filter((s:any) => s.status === 'ACCEPTED').length / profile.submissions.length) * 100)
                  : 0}%
              </span>
              <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[68%]" />
              </div>
            </div>
            <div className="glass-card p-6 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Global Rank</span>
              <span className="text-3xl font-black text-white">#412</span>
              <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[30%]" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            
            <div className="space-y-6">
              {profile?.submissions?.length > 0 ? (
                profile.submissions.map((sub: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${sub.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {sub.status === 'ACCEPTED' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{sub.problem.title}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                          {sub.language} • {new Date(sub.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/problems/${sub.problem.slug}`} className="opacity-0 group-hover:opacity-100 p-2 glass rounded-md transition-all">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground italic">No submissions yet. Start your journey!</p>
                  <Link href="/problems" className="text-primary font-bold mt-4 inline-block hover:underline">Browse Problems</Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Learning Progress Map (Conceptual) */}
          <div className="glass-card p-8 overflow-hidden relative">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold flex items-center gap-3">
                 <TrendingUp className="w-5 h-5 text-green-500" />
                 Skill Radar
               </h3>
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Updated Today</span>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {['Arrays', 'Strings', 'DP', 'Graphs'].map((skill) => (
                 <div key={skill} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2">{skill}</span>
                   <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
                     <span className="text-sm font-black">75%</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

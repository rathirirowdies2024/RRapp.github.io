
import React, { useState } from 'react';
import { useAuth } from '../App';
import { supabaseService } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { User, Shield, Save, Tag, Bookmark } from 'lucide-react';

const TOPICS = ['coding', 'design', 'minimalism', 'announcement', 'intro', 'architecture', 'productivity', 'ui-ux'];

const Settings: React.FC = () => {
  const { session, refreshSession } = useAuth();
  const [username, setUsername] = useState(session?.profile?.username || '');
  const [bio, setBio] = useState(session?.profile?.bio || '');
  const [interests, setInterests] = useState<string[]>(session?.profile?.interests || []);
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (topic: string) => {
    setInterests(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleUpdateProfile = async () => {
    if (!username) return toast.error("Username is required");
    setIsSaving(true);
    try {
      await supabaseService.updateProfile(session!.profile!.id, { username, bio, interests });
      await refreshSession();
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6">
      <h1 className="text-5xl font-black mb-16 tracking-tight">User Hub</h1>

      <div className="space-y-16">
        <section className="bg-white/5 border border-white/10 p-10 rounded-sm">
          <div className="flex items-center space-x-3 mb-10 pb-4 border-b border-white/5">
            <User className="text-white/40" />
            <h3 className="font-black uppercase tracking-widest text-xs">Public Identity</h3>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Handle</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-white/40 outline-none transition-colors font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Shadow Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-white/40 outline-none transition-colors text-sm"
              />
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 p-10 rounded-sm">
          <div className="flex items-center space-x-3 mb-10 pb-4 border-b border-white/5">
            <Tag className="text-white/40" />
            <h3 className="font-black uppercase tracking-widest text-xs">Interests & Curation</h3>
          </div>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">Select topics to tailor your "For You" feed. Personalization is stored locally in your ghost profile.</p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => toggleInterest(topic)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm border transition-all ${interests.includes(topic) ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/40'}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 p-10 rounded-sm">
          <div className="flex items-center space-x-3 mb-10 pb-4 border-b border-white/5">
            <Shield className="text-white/40" />
            <h3 className="font-black uppercase tracking-widest text-xs">Shadow Security</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-bold">Encrypted Email</p>
                <p className="text-xs text-white/20">{session?.user?.email}</p>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest border border-white/10 px-3 py-1 hover:border-white transition-colors">Change</button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-bold">Access Keys</p>
                <p className="text-xs text-white/20">Secured via RSA-4096 (Simulated)</p>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest border border-white/10 px-3 py-1 hover:border-white transition-colors">Rotate</button>
            </div>
          </div>
        </section>

        <div className="pt-8 sticky bottom-8">
          <button 
            onClick={handleUpdateProfile}
            disabled={isSaving}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl"
          >
            {isSaving ? <div className="w-5 h-5 border-3 border-black border-t-transparent animate-spin rounded-full"></div> : <Save size={20} />}
            <span>Sync Profiles</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

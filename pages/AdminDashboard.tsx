
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '../services/supabase';
import { useAuth } from '../App';
import { 
  Users, FileText, AlertTriangle, Activity, 
  Trash2, ShieldAlert, CheckCircle, Ban, ArrowUpRight 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { session } = useAuth();
  const [activeView, setActiveView] = useState<'posts' | 'users' | 'analytics'>('posts');
  const queryClient = useQueryClient();

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['admin-all-posts'],
    queryFn: () => supabaseService.getPosts()
  });

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => supabaseService.getSystemAnalytics()
  });

  const suspendMutation = useMutation({
    mutationFn: ({ userId, suspend }: { userId: string; suspend: boolean }) => 
      supabaseService.suspendUser(session!.profile!.id, userId, suspend),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    }
  });

  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col pt-12">
        <div className="px-8 mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Moderator Toolset</p>
        </div>
        
        <nav className="flex-grow px-4 space-y-1">
          {[
            { id: 'analytics', label: 'Global Stats', icon: <Activity size={18} /> },
            { id: 'posts', label: 'Content Review', icon: <FileText size={18} /> },
            { id: 'users', label: 'User Registry', icon: <Users size={18} /> },
            { id: 'reports', label: 'Flagged Content', icon: <AlertTriangle size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeView === item.id ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow p-12 overflow-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Admin Hub</h1>
            <p className="text-gray-400 font-medium">Platform-wide visibility and governance controls.</p>
          </div>
        </header>

        {activeView === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Views', val: analytics?.totalViews.toLocaleString(), color: 'bg-blue-50' },
              { label: 'Published Posts', val: analytics?.postCounts.published, color: 'bg-green-50' },
              { label: 'Active Users', val: analytics?.activeUsers, color: 'bg-orange-50' },
              { label: 'Engagement', val: analytics?.totalEngagement.toLocaleString(), color: 'bg-purple-50' },
            ].map(stat => (
              <div key={stat.label} className={`p-8 rounded-3xl border border-gray-100 ${stat.color}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{stat.label}</p>
                <p className="text-3xl font-black">{stat.val}</p>
              </div>
            ))}
          </div>
        )}

        {activeView === 'posts' && (
          <div className="space-y-4">
            {posts?.map(post => (
              <div key={post.id} className="elevated-card p-6 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <FileText />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{post.title}</h4>
                    <p className="text-xs text-gray-400 font-medium">By {post.author?.username} • {post.status.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><ArrowUpRight size={18} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-full text-red-500"><Ban size={18} /></button>
                  <button className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'users' && (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
            <Users className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold">Registry interface coming in next iteration.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

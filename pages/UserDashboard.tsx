
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '../services/supabase';
import { useAuth } from '../App';
import PostEditor from '../components/PostEditor';
import { DashboardSkeleton } from '../components/Skeleton';
import { 
  Plus, Edit, Trash2, Archive, Copy, 
  Clock, FileText, CheckCircle, BarChart3, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Post } from '../types';

const UserDashboard: React.FC = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['user-posts', session?.user?.id],
    queryFn: () => supabaseService.getPosts({ authorId: session?.user?.id }),
    enabled: !!session?.user?.id
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => supabaseService.createPost({ 
      ...data, 
      author_id: session!.profile!.id, 
      is_pinned: false, 
      tags: data.tags || [],
      status: 'published'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      setIsCreating(false);
      toast.success("Entry synchronized with archives");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => supabaseService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      setEditingPost(null);
      toast.success("Post updated successfully");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supabaseService.deletePost(session!.profile!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      toast.success("Post removed from index");
    }
  });

  const filteredPosts = posts?.filter(p => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  if (isCreating || editingPost) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <PostEditor 
          post={editingPost || {}} 
          onSave={async (data) => {
            if (editingPost) {
              updateMutation.mutate({ id: editingPost.id, data });
            } else {
              createMutation.mutate(data);
            }
          }} 
          onCancel={() => {
            setIsCreating(false);
            setEditingPost(null);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Creator Dashboard</h1>
          <p className="text-gray-400 font-medium">Manage your literary contributions and engagement metrics.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all shadow-xl"
        >
          <Plus size={18} />
          <span>New Insight</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-2">
          {[
            { id: 'all', label: 'All Contributions', icon: <FileText size={18} /> },
            { id: 'published', label: 'Published', icon: <CheckCircle size={18} /> },
            { id: 'draft', label: 'Drafts', icon: <Edit size={18} /> },
            { id: 'archived', label: 'Archived', icon: <Archive size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-black shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-white/50'
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
          
          <div className="pt-8">
             <div className="bg-black text-white p-6 rounded-3xl">
                <BarChart3 className="mb-4 text-gray-400" size={24} />
                <h4 className="font-bold mb-2">Deep Analytics</h4>
                <p className="text-xs text-gray-400 mb-4">View how your content resonates across the network.</p>
                <button className="text-[10px] font-black uppercase tracking-widest flex items-center group">
                  View Performance <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-4">
          {isLoading ? (
            <DashboardSkeleton />
          ) : filteredPosts?.length ? (
            <AnimatePresence mode="popLayout">
              {filteredPosts.map(post => (
                <motion.div 
                  layout
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="elevated-card p-6 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-6 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      post.status === 'published' ? 'bg-green-50 text-green-600' : 
                      post.status === 'draft' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {post.status === 'published' ? <CheckCircle size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate pr-4">{post.title}</h4>
                      <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center"><Clock size={10} className="mr-1" /> {new Date(post.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.view_count} Views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingPost(post)}
                      className="p-2.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="p-2.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Move this entry to the abyss?")) {
                          deleteMutation.mutate(post.id);
                        }
                      }}
                      className="p-2.5 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-24 bg-white border border-dashed border-gray-200 rounded-[2rem]">
              <FileText className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold">The void is silent. Start creating.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

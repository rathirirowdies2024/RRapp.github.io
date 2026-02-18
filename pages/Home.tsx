
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '../services/supabase';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['home-posts'],
    queryFn: () => supabaseService.getPosts({ status: 'published' })
  });

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-12">
          <header className="mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-6"
            >
              CRAFTED<br/><span className="text-gray-200">IN DARKNESS.</span>
            </motion.h1>
            <p className="text-xl text-gray-500 max-w-xl font-medium leading-relaxed">
              The premium destination for night-owl thinkers, elite designers, and visionary engineers.
            </p>
          </header>

          <div className="space-y-16">
            {isLoading ? (
              <div className="space-y-8">
                <PostSkeleton />
                <PostSkeleton />
              </div>
            ) : (
              posts?.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <aside className="lg:col-span-4 space-y-8 sticky top-28 self-start hidden lg:block">
          <section className="bg-white border border-gray-100 rounded-3xl p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Design', 'Engineering', 'Security', 'minimalism', 'IA', 'Web3'].map(tag => (
                <button key={tag} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-bold transition-all">
                  #{tag}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-black text-white rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Join the Rowdies</h3>
              <p className="text-gray-400 text-sm mb-6">Unlock deep metrics, collaboration tools, and dark-mode exclusives.</p>
              <button className="w-full py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 transition-all">
                Become a Member
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-10 -mt-10"></div>
          </section>
        </aside>

      </div>
    </div>
  );
};

export default Home;

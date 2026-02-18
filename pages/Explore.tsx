
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '../services/supabase';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/Skeleton';
import { Search, Compass, Zap, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Design', 'Engineering', 'Architecture', 'Security', 'Minimalism', 'Productivity'];

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['explore-posts', searchQuery, selectedCategory],
    queryFn: () => supabaseService.getPosts({ 
      status: 'published',
      search: searchQuery
    })
  });

  const filteredPosts = selectedCategory 
    ? posts?.filter(p => p.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase()))
    : posts;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12">
      <header className="mb-16">
        <div className="flex items-center space-x-4 mb-6 text-gray-400">
           <Compass size={24} />
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Discovery Engine</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-none mb-8">
          NAVIGATE THE<br/><span className="text-gray-200">KNOWLEDGE BASE.</span>
        </h1>

        <div className="relative max-w-2xl group">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 group-focus-within:text-black transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Search by topic, keyword, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 p-6 pl-16 rounded-2xl shadow-sm focus:shadow-xl focus:border-black outline-none transition-all text-lg font-medium"
          />
        </div>
      </header>

      <section className="mb-16">
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              !selectedCategory ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
            }`}
          >
            All Archives
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
              }`}
            >
              #{cat}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : filteredPosts?.length ? (
          <AnimatePresence>
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full text-center py-32 bg-white border border-dashed border-gray-200 rounded-[3rem]">
            <Hash className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold">No findings match your parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;


import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '../services/supabase';
import { PostSkeleton } from '../components/Skeleton';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => supabaseService.getPostById(id!),
    enabled: !!id
  });

  // Set document title dynamically
  useEffect(() => {
    if (post) document.title = `${post.title} | Rathiri Rowdies`;
    return () => { document.title = 'Rathiri Rowdies | RR Blog'; };
  }, [post]);

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-6">
      <PostSkeleton />
    </div>
  );

  if (error || !post) return (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center">
      <h2 className="text-4xl font-black mb-8">Post into the Void</h2>
      <p className="text-white/40 mb-12">The story you're looking for has dissolved into the shadows.</p>
      <Link to="/" className="inline-flex items-center px-8 py-3 border border-white/20 font-bold hover:bg-white hover:text-black transition-all">
        Back to Archives <ArrowUpRight size={18} className="ml-2" />
      </Link>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-6"
    >
      <div className="mb-12 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} className="mr-2" /> Feed
        </Link>
        <div className="text-[10px] font-bold text-white/20 tracking-widest uppercase">
          Ref: {post.id.slice(0, 8)}
        </div>
      </div>
      
      {/* Fixed: Removed non-existent 'expanded' prop to match PostCardProps definition */}
      <PostCard post={post} />

      <CommentSection postId={post.id} />

      <div className="mt-20 py-12 border-t border-white/5 flex flex-col items-center text-center">
        <h4 className="text-lg font-bold mb-4">Finished reading?</h4>
        <p className="text-white/40 text-sm mb-8">Spread the word or join the next conversation.</p>
        <Link to="/" className="text-sm font-black uppercase tracking-widest underline hover:text-white">
          Back to feed
        </Link>
      </div>
    </motion.div>
  );
};

export default PostDetail;

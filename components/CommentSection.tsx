
import React, { useState, useEffect } from 'react';
import { Comment, Profile } from '../types';
import { supabaseService } from '../services/supabase';
import { useAuth } from '../App';
import { Send, Reply, Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    const data = await supabaseService.getComments(postId);
    setComments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return toast.error("Sign in to comment");
    if (!newComment.trim()) return;

    try {
      await supabaseService.addComment(postId, session.profile!.id, newComment, replyTo || undefined);
      setNewComment('');
      setReplyTo(null);
      loadComments();
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  const renderComments = (parentId: string | null = null, depth = 0) => {
    return comments
      .filter(c => (parentId === null ? !c.parent_id : c.parent_id === parentId))
      .map(comment => (
        <div key={comment.id} className={`mb-6 ${depth > 0 ? 'ml-8 border-l border-white/10 pl-6' : ''}`}>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold border border-white/20">
              {comment.author?.username?.[0] || 'U'}
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-bold">{comment.author?.username}</span>
                <span className="text-[10px] text-white/30">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-3">{comment.content}</p>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-[10px] font-bold text-white/30 hover:text-white transition-colors">
                  <Heart size={12} />
                  <span>{comment.likes_count}</span>
                </button>
                <button 
                  onClick={() => setReplyTo(comment.id)}
                  className="flex items-center space-x-1 text-[10px] font-bold text-white/30 hover:text-white transition-colors"
                >
                  <Reply size={12} />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
          {renderComments(comment.id, depth + 1)}
        </div>
      ));
  };

  return (
    <section className="mt-20 pt-12 border-t border-white/5">
      <div className="flex items-center space-x-3 mb-10">
        <MessageSquare size={24} className="text-white/40" />
        <h3 className="text-2xl font-black tracking-tight">Discussion</h3>
        <span className="bg-white/10 px-2 py-0.5 rounded-sm text-xs font-bold text-white/60">{comments.length}</span>
      </div>

      <div className="bg-white/[0.03] p-6 rounded-sm border border-white/5 mb-12">
        <form onSubmit={handleSubmit}>
          {replyTo && (
            <div className="flex items-center justify-between bg-white/5 px-3 py-1 mb-4 rounded-sm">
              <span className="text-[10px] font-bold text-white/40">Replying to a comment...</span>
              <button onClick={() => setReplyTo(null)} className="text-[10px] font-bold hover:text-white">Cancel</button>
            </div>
          )}
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={session ? "Join the conversation..." : "Log in to join the discussion"}
            disabled={!session}
            className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-white/40 outline-none transition-colors text-sm mb-4 min-h-[100px]"
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={!session || !newComment.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-sm hover:scale-105 transition-all disabled:opacity-30"
            >
              <Send size={14} />
              <span>Post Comment</span>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-white/5 rounded-sm"></div>
            <div className="h-24 bg-white/5 rounded-sm"></div>
          </div>
        ) : comments.length > 0 ? (
          renderComments()
        ) : (
          <p className="text-center text-white/20 py-12 italic">Be the first to share your thoughts.</p>
        )}
      </div>
    </section>
  );
};

export default CommentSection;

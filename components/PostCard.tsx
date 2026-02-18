
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Calendar, User, ArrowRight, Heart, Bookmark, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="elevated-card rounded-[2rem] overflow-hidden group"
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="relative aspect-[21/9] overflow-hidden">
          <img 
            src={post.banner_url || `https://picsum.photos/seed/${post.id}/1200/600`} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-6 left-6 flex space-x-2">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-10">
          <div className="flex items-center space-x-4 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <span className="flex items-center"><Calendar size={12} className="mr-2" /> {new Date(post.created_at).toLocaleDateString()}</span>
            <span className="flex items-center"><User size={12} className="mr-2" /> {post.author?.username}</span>
            <span className="flex items-center"><Eye size={12} className="mr-2" /> {post.view_count} Views</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight group-hover:text-black transition-colors">
            {post.title}
          </h2>

          <p className="text-gray-500 text-lg leading-relaxed line-clamp-2 mb-10 font-medium">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-8 border-t border-gray-50">
            <div className="flex items-center space-x-6 text-gray-400">
              <button className="flex items-center space-x-2 hover:text-black transition-colors group/btn">
                <Heart size={20} className="group-hover/btn:scale-110 transition-transform" />
                <span className="text-xs font-bold">{post.likes_count}</span>
              </button>
              <button className="hover:text-black transition-colors">
                <Bookmark size={20} />
              </button>
            </div>
            
            <span className="text-xs font-black uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform">
              Read Insight <ArrowRight size={14} className="ml-2" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default PostCard;

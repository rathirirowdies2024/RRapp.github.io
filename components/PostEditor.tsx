
import React, { useState } from 'react';
import { Post } from '../types';
import { Sparkles, Save, X, Eye, Edit3 } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostEditorProps {
  post?: Partial<Post>;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [bannerUrl, setBannerUrl] = useState(post?.banner_url || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAiSuggest = async () => {
    if (!title) {
      toast.error("Add a title first for better context.");
      return;
    }
    setIsAiLoading(true);
    const suggestion = await geminiService.suggestBlogContinuation(title, content);
    setContent(prev => prev + "\n\n" + suggestion);
    setIsAiLoading(false);
    toast.success("AI suggestion added!");
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Title and Content are required.");
      return;
    }
    setIsSaving(true);
    try {
      const excerpt = await geminiService.summarizePost(content);
      // Fixed: Use 'status' property which exists on the Post type instead of 'is_published'
      await onSave({
        title,
        content,
        excerpt,
        banner_url: bannerUrl,
        status: post?.status ?? 'published'
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 mb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <h3 className="text-xl font-bold">{post?.id ? 'Edit Post' : 'New Post'}</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-sm text-sm transition-colors"
          >
            {isPreview ? <><Edit3 size={14} /> <span>Edit</span></> : <><Eye size={14} /> <span>Preview</span></>}
          </button>
          <button 
            onClick={onCancel}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {!isPreview ? (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Banner Image URL</label>
            <input 
              type="text"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-black border border-white/10 p-3 rounded-sm focus:border-white/40 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The midnight session..."
              className="w-full bg-black border border-white/10 p-4 text-2xl font-bold rounded-sm focus:border-white/40 outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Content (Markdown)</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Write something amazing..."
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-white/40 outline-none transition-colors font-mono text-sm leading-relaxed"
            />
            
            <button 
              onClick={handleAiSuggest}
              disabled={isAiLoading}
              className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:scale-105 transition-all disabled:opacity-50"
            >
              {isAiLoading ? (
                <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <Sparkles size={14} />
              )}
              <span>AI Suggestion</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="prose-custom min-h-[400px]">
          <h1 className="text-4xl font-extrabold mb-8">{title || 'Untitled Post'}</h1>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '*No content yet*'}
          </ReactMarkdown>
        </div>
      )}

      <div className="mt-10 flex justify-end space-x-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-8 py-3 bg-white text-black font-bold rounded-sm hover:bg-white/90 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
          ) : (
            <Save size={18} />
          )}
          <span>Save Post</span>
        </button>
      </div>
    </div>
  );
};

export default PostEditor;

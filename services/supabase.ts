
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post, Profile, AuditLog, UserRole, Comment } from '../types';

// Provided Supabase production credentials
const SUPABASE_URL = 'https://hlszevskpqtftascopcy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_w1prt-_dEickMmnWglmLwQ_tyf41lAt';

// If credentials are valid, we prioritize real Supabase integration.
const useMock = !SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('placeholder');

class ProductionSupabaseService {
  private client: SupabaseClient | null = null;
  
  // Storage keys for mock fallback (maintained for backward compatibility/offline use)
  private STORAGE_KEY_POSTS = 'rr_posts_v4';
  private STORAGE_KEY_PROFILES = 'rr_profiles_v4';
  private STORAGE_KEY_SESSION = 'rr_session_v4';
  private STORAGE_KEY_COMMENTS = 'rr_comments_v4';

  constructor() {
    if (!useMock) {
      this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
      console.warn("Supabase credentials missing or invalid. Falling back to LocalStorage Mock Mode.");
      this.initializeMockData();
    }
  }

  private initializeMockData() {
    if (!localStorage.getItem(this.STORAGE_KEY_PROFILES)) {
      const admin: Profile = {
        id: 'admin-001',
        username: 'Architect',
        role: 'admin',
        status: 'active',
        onboarding_completed: true
      };
      localStorage.setItem(this.STORAGE_KEY_PROFILES, JSON.stringify([admin]));
    }
  }

  // --- AUTHENTICATION ---

  async getSession() {
    if (this.client) {
      try {
        const { data: { session } } = await this.client.auth.getSession();
        if (!session) return null;
        
        const { data: profile, error } = await this.client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows returned'
        
        return { user: session.user, profile: (profile as Profile) || null };
      } catch (err) {
        console.error("Session fetch error:", err);
        return null;
      }
    } else {
      const sessionStr = localStorage.getItem(this.STORAGE_KEY_SESSION);
      if (!sessionStr) return null;
      const parsed = JSON.parse(sessionStr);
      const profiles = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PROFILES) || '[]');
      const profile = profiles.find((p: Profile) => p.id === parsed.id);
      return { user: { id: parsed.id, email: parsed.email }, profile: profile || null };
    }
  }

  async login(email: string) {
    if (this.client) {
      const { error } = await this.client.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      return null; 
    } else {
      const id = email === 'admin@rr.com' ? 'admin-001' : 'user-' + Date.now();
      const session = { id, email };
      localStorage.setItem(this.STORAGE_KEY_SESSION, JSON.stringify(session));
      return this.getSession();
    }
  }

  async logout() {
    if (this.client) {
      await this.client.auth.signOut();
    } else {
      localStorage.removeItem(this.STORAGE_KEY_SESSION);
    }
  }

  // --- POSTS ---

  async getPosts(filters?: { status?: string; authorId?: string; search?: string }) {
    if (this.client) {
      let query = this.client
        .from('posts')
        .select('*, author:profiles(*)');
        
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.authorId) query = query.eq('author_id', filters.authorId);
      if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Post[];
    } else {
      const posts = JSON.parse(localStorage.getItem(this.STORAGE_KEY_POSTS) || '[]');
      const profiles = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PROFILES) || '[]');
      
      let filtered = [...posts];
      if (filters?.status) filtered = filtered.filter((p: Post) => p.status === filters.status);
      if (filters?.authorId) filtered = filtered.filter((p: Post) => p.author_id === filters.authorId);
      
      return filtered.map((p: Post) => ({
        ...p,
        author: profiles.find((prof: Profile) => prof.id === p.author_id)
      }));
    }
  }

  async getPostById(id: string) {
    if (this.client) {
      const { data, error } = await this.client
        .from('posts')
        .select('*, author:profiles(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Post;
    } else {
      const posts = JSON.parse(localStorage.getItem(this.STORAGE_KEY_POSTS) || '[]');
      const profiles = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PROFILES) || '[]');
      const post = posts.find((p: Post) => p.id === id);
      if (!post) return null;
      return { ...post, author: profiles.find((p: Profile) => p.id === post.author_id) };
    }
  }

  async createPost(post: Partial<Post>) {
    if (this.client) {
      const { data, error } = await this.client
        .from('posts')
        .insert([post])
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const posts = JSON.parse(localStorage.getItem(this.STORAGE_KEY_POSTS) || '[]');
      const newPost = {
        ...post,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        view_count: 0,
        likes_count: 0
      };
      posts.unshift(newPost);
      localStorage.setItem(this.STORAGE_KEY_POSTS, JSON.stringify(posts));
      return newPost;
    }
  }

  async updatePost(id: string, updates: Partial<Post>) {
    if (this.client) {
      const { data, error } = await this.client
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const posts = JSON.parse(localStorage.getItem(this.STORAGE_KEY_POSTS) || '[]');
      const idx = posts.findIndex((p: Post) => p.id === id);
      if (idx !== -1) {
        posts[idx] = { ...posts[idx], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem(this.STORAGE_KEY_POSTS, JSON.stringify(posts));
      }
    }
  }

  async deletePost(performerId: string, id: string) {
    if (this.client) {
      const { error } = await this.client
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } else {
      const posts = JSON.parse(localStorage.getItem(this.STORAGE_KEY_POSTS) || '[]');
      const filtered = posts.filter((p: Post) => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY_POSTS, JSON.stringify(filtered));
    }
  }

  // --- COMMENTS ---

  async getComments(postId: string) {
    if (this.client) {
      const { data, error } = await this.client
        .from('comments')
        .select('*, author:profiles(*)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Comment[];
    } else {
      const comments = JSON.parse(localStorage.getItem(this.STORAGE_KEY_COMMENTS) || '[]');
      const profiles = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PROFILES) || '[]');
      const filtered = comments.filter((c: Comment) => c.post_id === postId);
      return filtered.map((c: Comment) => ({
        ...c,
        author: profiles.find((p: Profile) => p.id === c.author_id)
      }));
    }
  }

  async addComment(postId: string, authorId: string, content: string, parentId?: string) {
    const commentData = {
      post_id: postId,
      author_id: authorId,
      content,
      parent_id: parentId,
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    if (this.client) {
      const { data, error } = await this.client
        .from('comments')
        .insert([commentData])
        .select('*, author:profiles(*)')
        .single();
      if (error) throw error;
      return data as Comment;
    } else {
      const comments = JSON.parse(localStorage.getItem(this.STORAGE_KEY_COMMENTS) || '[]');
      const newComment = {
        ...commentData,
        id: crypto.randomUUID()
      };
      comments.push(newComment);
      localStorage.setItem(this.STORAGE_KEY_COMMENTS, JSON.stringify(comments));
      return newComment;
    }
  }

  // --- ANALYTICS & ADMIN ---

  async getSystemAnalytics() {
    if (this.client) {
      try {
        const { count: viewsCount } = await this.client.from('posts').select('view_count', { count: 'exact', head: true });
        const { count: postsCount } = await this.client.from('posts').select('id', { count: 'exact', head: true });
        const { count: usersCount } = await this.client.from('profiles').select('id', { count: 'exact', head: true });
        
        return { 
          totalViews: viewsCount || 0, 
          totalEngagement: 0, 
          activeUsers: usersCount || 0, 
          postCounts: { published: postsCount || 0, draft: 0 } 
        };
      } catch (err) {
        return { totalViews: 0, totalEngagement: 0, activeUsers: 0, postCounts: { published: 0, draft: 0 } };
      }
    } else {
      const posts = JSON.parse(localStorage.getItem(this.STORAGE_KEY_POSTS) || '[]');
      return {
        totalViews: posts.reduce((acc: number, p: Post) => acc + (p.view_count || 0), 0),
        totalEngagement: posts.reduce((acc: number, accP: Post) => acc + (accP.likes_count || 0), 0),
        activeUsers: JSON.parse(localStorage.getItem(this.STORAGE_KEY_PROFILES) || '[]').length,
        postCounts: {
          published: posts.filter((p: Post) => p.status === 'published').length,
          draft: posts.filter((p: Post) => p.status === 'draft').length
        }
      };
    }
  }

  async suspendUser(performerId: string, userId: string, suspend: boolean) {
    const status = suspend ? 'suspended' : 'active';
    if (this.client) {
      const { error } = await this.client
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      if (error) throw error;
    } else {
      const profiles = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PROFILES) || '[]');
      const idx = profiles.findIndex((p: Profile) => p.id === userId);
      if (idx !== -1) {
        profiles[idx].status = status;
        localStorage.setItem(this.STORAGE_KEY_PROFILES, JSON.stringify(profiles));
      }
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    if (this.client) {
      const { data, error } = await this.client
        .from('profiles')
        .upsert({ id: userId, ...updates })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const profiles = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PROFILES) || '[]');
      const idx = profiles.findIndex((p: Profile) => p.id === userId);
      if (idx !== -1) {
        profiles[idx] = { ...profiles[idx], ...updates };
        localStorage.setItem(this.STORAGE_KEY_PROFILES, JSON.stringify(profiles));
        return profiles[idx];
      } else {
        const newProfile = { id: userId, role: 'user', status: 'active', ...updates };
        profiles.push(newProfile);
        localStorage.setItem(this.STORAGE_KEY_PROFILES, JSON.stringify(profiles));
        return newProfile;
      }
    }
  }
}

export const supabaseService = new ProductionSupabaseService();

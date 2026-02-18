
export type UserRole = 'admin' | 'editor' | 'moderator' | 'user';

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  role: UserRole;
  full_name?: string;
  bio?: string;
  social_links?: { twitter?: string; github?: string; website?: string };
  interests?: string[];
  bookmarks?: string[];
  onboarding_completed?: boolean;
  status?: 'active' | 'suspended' | 'shadow_banned';
  mfa_enabled?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  banner_url?: string;
  author_id: string;
  author?: Profile;
  created_at: string;
  updated_at: string;
  scheduled_at?: string;
  status: 'draft' | 'published' | 'archived';
  is_pinned: boolean;
  tags: string[];
  likes_count: number;
  view_count: number;
  reading_time?: number;
  version?: number;
}

// Added Comment interface to support discussion features
export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: Profile;
  content: string;
  parent_id?: string;
  likes_count: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performer_id: string;
  target_id: string;
  details: string;
  timestamp: string;
}

export interface UserSession {
  user: {
    id: string;
    email?: string;
  } | null;
  profile: Profile | null;
}

export enum AppRoute {
  HOME = '/',
  EXPLORE = '/explore',
  TRENDING = '/trending',
  CATEGORIES = '/categories',
  BOOKMARKS = '/bookmarks',
  NOTIFICATIONS = '/notifications',
  POST = '/post/:id',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  ADMIN = '/admin',
  ADMIN_USERS = '/admin/users',
  ADMIN_REPORTS = '/admin/reports',
  ADMIN_LOGS = '/admin/logs',
  ANALYTICS = '/analytics',
  SETTINGS = '/settings'
}

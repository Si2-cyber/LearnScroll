import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Card, Category } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export type LearnScrollDatabase = {
  public: {
    Tables: {
      cards: {
        Row: SupabaseCardRow;
        Insert: SupabaseCardInsert;
        Update: Partial<SupabaseCardInsert>;
      };
      card_likes: {
        Row: SupabaseCardLikeRow;
        Insert: SupabaseCardLikeInsert;
        Update: Partial<SupabaseCardLikeInsert>;
      };
    };
    Functions: {
      toggle_card_like: {
        Args: { p_card_id: string; p_liked: boolean };
        Returns: number;
      };
    };
  };
};

export type SupabaseCardRow = {
  id: string;
  title: string;
  category: string;
  paragraphs: string[];
  takeaway: string;
  hashtags: string[];
  background_color: string;
  channel_name: string;
  likes_count: number;
  comments_count: number;
  created_at?: string;
  updated_at?: string;
};

export type SupabaseCardInsert = {
  id: string;
  title: string;
  category: string;
  paragraphs: string[];
  takeaway: string;
  hashtags: string[];
  background_color: string;
  channel_name: string;
  likes_count?: number;
  comments_count?: number;
};

export type SupabaseCardLikeRow = {
  card_id: string;
  user_id: string;
  created_at: string;
};

export type SupabaseCardLikeInsert = {
  card_id: string;
  user_id?: string;
};

export const supabase = isSupabaseConfigured
  ? createClient<LearnScrollDatabase>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export function mapSupabaseCardRowToCard(row: SupabaseCardRow): Card {
  return {
    id: row.id,
    title: row.title,
    category: row.category as Category,
    paragraphs: Array.isArray(row.paragraphs) ? row.paragraphs : [],
    takeaway: row.takeaway,
    hashtags: Array.isArray(row.hashtags) ? row.hashtags : [],
    backgroundColor: row.background_color,
    channelName: row.channel_name,
    likesCount: row.likes_count ?? 0,
    commentsCount: row.comments_count ?? 0,
  };
}

export function mapCardToSupabaseInsert(card: Card): SupabaseCardInsert {
  return {
    id: card.id,
    title: card.title,
    category: card.category,
    paragraphs: card.paragraphs,
    takeaway: card.takeaway,
    hashtags: card.hashtags,
    background_color: card.backgroundColor,
    channel_name: card.channelName,
    likes_count: card.likesCount,
    comments_count: card.commentsCount,
  };
}

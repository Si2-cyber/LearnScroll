/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category =
  | 'Book summaries'
  | 'Recent world news'
  | 'Trivia & fun facts'
  | 'Study & focus tips'
  | 'Music recommendations'
  | 'Science & nature facts'
  | 'History highlights'
  | 'Philosophy & quotes'
  | 'Language learning snippets'
  | 'Life skills & how-to tips';

export interface BookmarkMetadata {
  addedAt: number;
  lastSeenAt?: number;
}

export interface Card {
  id: string;
  title: string;
  category: Category;
  paragraphs: string[];
  takeaway: string;
  hashtags: string[];
  backgroundColor: string; // Hex representation suitable for dark reading mood
  textColor?: string; // Text overlay style color
  channelName: string; // Suggested channel, e.g. "FactMinds" or "BookSummarizer"
  likesCount: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  cardId: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface UserProfile {
  username: string;
  email: string;
  interests: Category[];
  openaiApiKey?: string;
  subscribedChannels: string[]; // Set of followed channels
}

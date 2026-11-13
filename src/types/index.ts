/* SocialSamurai app types. Platforms are limited to what the product supports. */

export type PlatformType = 'x' | 'reddit';

export type PersonalityId = 'strategist' | 'hunter' | 'creator' | 'warrior' | 'sensei' | 'ronin';

export type ReplyTone = 'Helpful' | 'Professional' | 'Technical' | 'Casual' | 'Concise' | 'Bold';

export type Intent = 'Asking for a tool' | 'Comparing options' | 'Problem aware' | 'Seeking advice' | 'Discussion';

export interface Signals {
  relevance: number;
  intent: number;
  fit: number;
  engagement: number;
  recency: number;
}

export interface Opportunity {
  id: string;
  platform: PlatformType;
  author: string;
  handle: string;
  /** Subreddit for Reddit, empty for X */
  community?: string;
  age: string;
  text: string;
  topic: string;
  intent: Intent;
  score: number;
  signals: Signals;
  why: string;
  drafts: Partial<Record<ReplyTone, string>>;
  status: 'new' | 'saved' | 'drafted' | 'approved' | 'dismissed';
}

export interface Draft {
  id: string;
  opportunityId: string;
  tone: ReplyTone;
  text: string;
  status: 'awaiting' | 'approved';
  updatedAt: string;
}

export interface ScheduledPost {
  id: string;
  platform: PlatformType;
  content: string;
  /** ISO date-time */
  when: string;
  status: 'scheduled' | 'draft';
}

export interface InboxItem {
  id: string;
  platform: PlatformType;
  author: string;
  handle: string;
  kind: 'mention' | 'reply' | 'question';
  text: string;
  summary: string;
  suggestedReply: string;
  age: string;
  read: boolean;
}

export interface SocialAccount {
  platform: PlatformType;
  /** In the preview, a connection is simulated — no real sign-in happens. */
  connected: boolean;
  handle?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  age: string;
  read: boolean;
}

export interface BrandProfile {
  name: string;
  brand: string;
  product: string;
  audience: string;
  voice: string;
  personality: PersonalityId;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export type ViewTab =
  | 'landing'
  | 'dashboard'
  | 'opportunities'
  | 'drafts'
  | 'create'
  | 'inbox'
  | 'calendar'
  | 'analytics'
  | 'battle'
  | 'connections'
  | 'automation'
  | 'settings';

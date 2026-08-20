export type MascotState =
  | 'ready'
  | 'scanning'
  | 'thinking'
  | 'focused'
  | 'idea'
  | 'working'
  | 'excited'
  | 'happy'
  | 'celebration'
  | 'guard';

export type PlatformType = 'x' | 'reddit' | 'linkedin';

export type SamuraiArchetypeId =
  | 'strategist'
  | 'hunter'
  | 'creator'
  | 'warrior'
  | 'sensei'
  | 'ronin';

export interface SamuraiArchetype {
  id: SamuraiArchetypeId;
  name: string;
  title: string;
  tagline: string;
  color: string;
  accentColor: string;
  weapon: string;
  avatarUrl: string;
  aiPersonality: {
    traits: string[];
    description: string;
    toneDefault: string;
    promptDirective: string;
  };
  gameplayIdentity: {
    archetype: string;
    specialAbility: string;
    specialDescription: string;
    stats: {
      speed: number;    // 1-5
      damage: number;   // 1-5
      defense: number;  // 1-5
      critical: number; // 1-5
      utility: number;  // 1-5
    };
  };
}

export interface SocialAccount {
  id: string;
  platform: PlatformType;
  handle: string;
  name: string;
  avatar: string;
  connected: boolean;
  connectedAt?: string;
  scopes: string[];
  capabilities: {
    read: boolean;
    search: boolean;
    post: boolean;
    reply: boolean;
  };
  lastSynced?: string;
}

export type IntentClassification =
  | 'Buying Intent'
  | 'Problem Aware'
  | 'Discussion'
  | 'Thought Leadership'
  | 'Community';

export interface OpportunityWhyPicked {
  productFit: string;
  intent: string;
  freshness: string;
  competition: string;
}

export interface AuthorProfileIntelligence {
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  followers?: string;
  recentActivity: string;
  relevantTopics: string[];
  aiSummary: string;
  recommendation: 'High Value — Engage Immediately' | 'Worth Engaging' | 'Optional Lead';
}

export interface Opportunity {
  id: string;
  platform: PlatformType;
  authorHandle: string;
  authorName: string;
  authorAvatar: string;
  postContent: string;
  matchedTopic: string;
  opportunityScore: number; // 0-100
  scoreTier: 'Excellent Opportunity' | 'Worth Considering' | 'Low Priority';
  intent: IntentClassification;
  whySamuraiPickedThis: OpportunityWhyPicked;
  profileIntelligence: AuthorProfileIntelligence;
  engagement: {
    likes: number;
    replies: number;
    reposts?: number;
  };
  postedAge: string;
  isLead?: boolean;
  isSpam?: boolean;
  saved?: boolean;
  dismissed?: boolean;
  replied?: boolean;
}

export type ReplyTone =
  | 'Default'
  | 'Helpful'
  | 'Casual'
  | 'Professional'
  | 'Technical'
  | 'Bold'
  | 'Funny'
  | 'Contrarian'
  | 'Educational'
  | 'Concise';

export type ReplyLength = 'Short' | 'Medium' | 'Detailed';

export interface AntiAISlopEvaluation {
  slopRisk: 'Low' | 'Medium' | 'High';
  score: number; // 0-100 (100 = perfectly natural/slop-free)
  checks: {
    noGenericPraise: boolean;
    noCorporateFluff: boolean;
    noRepetitivePhrasing: boolean;
    authenticTone: boolean;
    platformNative: boolean;
  };
  feedback: string;
}

export interface AIReplyOption {
  tone: ReplyTone;
  content: string;
  slopEvaluation: AntiAISlopEvaluation;
}

export interface DraftReply {
  id: string;
  opportunityId: string;
  platform: PlatformType;
  originalPost: string;
  authorHandle: string;
  selectedTone: ReplyTone;
  selectedLength: ReplyLength;
  draftText: string;
  status: 'pending' | 'edited' | 'approved' | 'posted' | 'discarded';
  createdAt: string;
  slopEvaluation: AntiAISlopEvaluation;
}

export interface ScheduledPost {
  id: string;
  platform: PlatformType;
  content: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'draft';
  targetAudience?: string;
}

export interface InboxItem {
  id: string;
  platform: PlatformType;
  authorHandle: string;
  authorAvatar: string;
  messageType: 'mention' | 'reply' | 'question' | 'lead';
  content: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  aiSummary: string;
  suggestedReply: string;
  timestamp: string;
  read: boolean;
}

export interface AIPreferenceRule {
  id: string;
  category: string;
  insight: string;
  confidence: number;
  updatedAt: string;
}

export interface UserSubscription {
  plan: 'free' | 'samurai';
  billingCycle: 'monthly' | 'yearly';
  renewsAt: string;
  entitlement: 'samurai_pro' | 'free_tier';
}

export interface UserUsageLimits {
  dailyOpportunitiesCount: number;
  dailyOpportunitiesMax: number;
  monthlyRepliesCount: number;
  monthlyRepliesMax: number;
  monthlyPostsCount: number;
  monthlyPostsMax: number;
  dailyCreditsCount: number;
  dailyCreditsMax: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'opportunity' | 'battle' | 'system' | 'published' | 'lead';
  timestamp: string;
  read: boolean;
}

export interface ABTestResult {
  id: string;
  opportunityTopic: string;
  variantA: { tone: ReplyTone; replies: number; engagementRate: number };
  variantB: { tone: ReplyTone; replies: number; engagementRate: number };
  winningTone: ReplyTone;
  improvement: string;
}

export type ViewTab =
  | 'landing'
  | 'dashboard'
  | 'opportunities'
  | 'reply-studio'
  | 'create'
  | 'inbox'
  | 'calendar'
  | 'analytics'
  | 'battle'
  | 'connections'
  | 'automation'
  | 'settings';

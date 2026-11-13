/**
 * Sample data for the interactive preview.
 * Everything here is invented for demonstration and is labelled as sample data
 * in the UI. No real accounts, follower counts or performance figures.
 */
import type {
  AutomationRule,
  BrandProfile,
  Draft,
  InboxItem,
  NotificationItem,
  Opportunity,
  ScheduledPost,
  SocialAccount,
} from '../types';

export const INITIAL_PROFILE: BrandProfile = {
  name: 'Vikrant',
  brand: 'SocialSamurai',
  product: 'AI social command center that finds conversations worth joining on X and Reddit',
  audience: 'Founders, indie hackers and small marketing teams',
  voice: 'Helpful, direct, no hype',
  personality: 'hunter',
};

export const INITIAL_KEYWORDS = ['alternative to', 'any recommendations', 'social listening', 'reddit marketing', 'find customers'];

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  { platform: 'x', connected: false },
  { platform: 'reddit', connected: false },
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1', platform: 'reddit', author: 'quiet_builder', handle: 'u/quiet_builder', community: 'r/SaaS', age: '12m',
    text: 'Is there a tool that finds threads where people are asking for recommendations? Searching Reddit by hand eats my whole morning and I still miss the good ones.',
    topic: 'any recommendations', intent: 'Asking for a tool', score: 94,
    signals: { relevance: 96, intent: 95, fit: 90, engagement: 72, recency: 98 },
    why: 'Asks directly for a tool in your category and describes the exact problem you solve. A practical, non-promotional answer fits the thread.',
    drafts: {
      Helpful: 'Same problem here. What helped was searching for the phrases people use when they’re stuck — “any recommendations for”, “alternative to” — instead of your category name. That’s where the intent is.',
      Concise: 'Search for the problem, not the category. “Any recommendations for…” finds the people who are ready to try something.',
      Professional: 'A practical approach: monitor intent phrases such as “alternative to” and “recommendations for” rather than category keywords. They surface far more relevant threads.',
    },
    status: 'new',
  },
  {
    id: 'o2', platform: 'x', author: 'Jo Patel', handle: '@jo_builds', age: '34m',
    text: 'Looking for an alternative to our social listening setup. It flags every mention except the people who actually want to buy.',
    topic: 'alternative to', intent: 'Comparing options', score: 89,
    signals: { relevance: 92, intent: 90, fit: 86, engagement: 64, recency: 95 },
    why: 'Actively evaluating alternatives, with a specific complaint about noise that you can speak to.',
    drafts: {
      Helpful: 'Most listening tools match keywords, not intent. Filtering for questions and complaints — rather than every mention — cut our noise a lot. Happy to share how we set it up.',
      Technical: 'Keyword matching returns mentions; you want intent. Filter for interrogatives and comparison phrases (“alternative to”, “vs”), then rank by recency. Noise drops fast.',
    },
    status: 'new',
  },
  {
    id: 'o3', platform: 'reddit', author: 'maya_ships', handle: 'u/maya_ships', community: 'r/startups', age: '1h',
    text: 'How do you decide which conversations are worth replying to as a solo founder? I can’t answer everything and I don’t want to sound like an ad.',
    topic: 'find customers', intent: 'Seeking advice', score: 81,
    signals: { relevance: 84, intent: 76, fit: 88, engagement: 70, recency: 90 },
    why: 'Discussion question where experience is valued over promotion — a good place to be useful.',
    drafts: {
      Helpful: 'I use three filters: are they asking for help, are they my audience, and can I add something specific? If any answer is no, I skip it. Keeps replies useful and never salesy.',
      Casual: 'Honestly I just ask: would I answer this if I didn’t have a product? If yes, reply. If not, skip.',
    },
    status: 'new',
  },
  {
    id: 'o4', platform: 'x', author: 'Indie Maker', handle: '@indiemaker_ana', age: '2h',
    text: 'How do people do reddit marketing without getting banned? Every post I make gets removed by mods within minutes.',
    topic: 'reddit marketing', intent: 'Problem aware', score: 74,
    signals: { relevance: 80, intent: 70, fit: 78, engagement: 66, recency: 82 },
    why: 'A how-to question with a clear pain. Advice-first replies tend to land well here.',
    drafts: {
      Helpful: 'Lead with answers, not links. Spend a week replying to questions in the subreddit before posting anything of your own — mods notice who contributes.',
    },
    status: 'new',
  },
  {
    id: 'o5', platform: 'reddit', author: 'growth_notes', handle: 'u/growth_notes', community: 'r/marketing', age: '4h',
    text: 'Hot take: scheduling tools made social worse. Nobody replies anymore, everyone just broadcasts into the void.',
    topic: 'social listening', intent: 'Discussion', score: 58,
    signals: { relevance: 62, intent: 40, fit: 66, engagement: 74, recency: 70 },
    why: 'An opinion thread. Worth joining only if you have a genuine point of view to add.',
    drafts: {
      Bold: 'Agree with half of this. Scheduling is fine for posts — the mistake is treating replies the same way. Conversations can’t be queued.',
    },
    status: 'new',
  },
];

export const INITIAL_DRAFTS: Draft[] = [];

export const INITIAL_SCHEDULED: ScheduledPost[] = (() => {
  const d = new Date();
  const at = (days: number, h: number) => {
    const x = new Date(d);
    x.setDate(d.getDate() + days);
    x.setHours(h, 0, 0, 0);
    return x.toISOString();
  };
  return [
    { id: 's1', platform: 'x', content: 'Most “social listening” is just mention counting. The useful part is finding the people asking for help — and answering them well.', when: at(1, 10), status: 'scheduled' },
    { id: 's2', platform: 'reddit', content: 'What I learned answering 50 “any recommendations?” threads without getting banned (r/SaaS write-up)', when: at(3, 18), status: 'scheduled' },
  ];
})();

export const INITIAL_INBOX: InboxItem[] = [
  {
    id: 'i1', platform: 'x', author: 'Sam R.', handle: '@samr_dev', kind: 'question', age: '25m', read: false,
    text: 'Saw your thread on intent keywords — does this work for B2B or mostly consumer stuff?',
    summary: 'Follow-up question on your post; asks about B2B fit.',
    suggestedReply: 'Works well for B2B — arguably better, since buyers ask very specific questions. Start with “alternative to [competitor]” and “how do you handle [problem]”.',
  },
  {
    id: 'i2', platform: 'reddit', author: 'lena_codes', handle: 'u/lena_codes', kind: 'reply', age: '1h', read: false,
    text: 'This is useful, thanks. What subreddits would you start with for dev tools?',
    summary: 'Thanks you, then asks for subreddit suggestions.',
    suggestedReply: 'For dev tools I’d start with r/webdev, r/programming (careful — strict rules) and the subreddit for the language your users work in. Read the sidebar rules first.',
  },
  {
    id: 'i3', platform: 'x', author: 'Priya', handle: '@priya_growth', kind: 'mention', age: '3h', read: true,
    text: 'Good breakdown from @socialsamurai on replying vs broadcasting 👇',
    summary: 'Positive mention sharing your post.',
    suggestedReply: 'Thanks for sharing, Priya! Curious which part matched your experience most.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Welcome to the preview', message: 'Everything here runs on sample data. Nothing is posted anywhere.', age: 'Now', read: false },
  { id: 'n2', title: '5 sample opportunities ready', message: 'Open Opportunities to see how scoring works.', age: 'Now', read: false },
];

export const INITIAL_RULES: AutomationRule[] = [
  { id: 'r1', title: 'Morning scan', description: 'Check your keywords on X and Reddit every morning at 8:00.', enabled: true },
  { id: 'r2', title: 'High-score alerts', description: 'Notify me when a conversation scores 85 or higher.', enabled: true },
  { id: 'r3', title: 'Prepare drafts', description: 'Draft a reply for every alert, ready for review.', enabled: false },
  { id: 'r4', title: 'Weekly summary', description: 'Friday recap of replies, posts and what earned a response.', enabled: false },
];

export const CREDITS = { start: 6, max: 10 };

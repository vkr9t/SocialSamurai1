/**
 * Marketing-site content. Copy, prices, personalities and FAQ live here.
 *
 * Honesty rules (brand brief):
 *  - No invented statistics, customers, testimonials or partnerships.
 *  - Nothing is described as live unless it is. Today the product is an
 *    interactive preview on sample data; X and Reddit connections are in
 *    development. Update STATUS when that changes.
 */

export const ART = {
  logo: '/brand/logo.webp',
  logoFallback: '/brand/logo.png',
  mark: '/brand/mark.webp',
  /** Samurai from the brand guidelines. Swap for a higher-resolution export any time. */
  samurai: '/brand/samurai.webp',
  samuraiSmall: '/brand/samurai-640.webp',
  helm: '/brand/samurai-helm.webp',
} as const;

export const STATUS = {
  short: 'Early access',
  long: 'SocialSamurai is in early development. The interactive preview runs on sample data; live X and Reddit connections are being built now.',
};

/** Proposed pricing — not final. */
export const PRICING = {
  currency: '$',
  monthly: 19,
  yearly: 140,
  note: 'Proposed launch pricing. Plan details, including credit allowances, will be confirmed before public launch.',
};

export const NAV = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'personalities', label: 'Personalities' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'resources', label: 'Resources' },
] as const;

export const MANIFESTO =
  'Every day, people ask for recommendations, complain about the tools they use, and describe the exact problem you solve. Most of those conversations scroll past unanswered. SocialSamurai finds them, tells you which ones are worth your time, and helps you reply in your own voice — with you approving every word.';

export type Step = { key: string; kanji: string; reading: string; title: string; body: string };

export const STEPS: Step[] = [
  { key: 'discover', kanji: '発見', reading: 'Discovery', title: 'Discover', body: 'Your keywords, topics and business context, turned into a focused stream of conversations from X and Reddit.' },
  { key: 'understand', kanji: '理解', reading: 'Understanding', title: 'Understand', body: 'Each conversation is scored on relevance, intent, audience fit, engagement and recency — with a plain-language reason it was picked.' },
  { key: 'respond', kanji: '応答', reading: 'Response', title: 'Respond', body: 'A draft that fits the thread and sounds like your brand. Change the tone, regenerate it, or write your own.' },
  { key: 'engage', kanji: '承認', reading: 'Approval', title: 'Engage', body: 'You edit, approve and publish through the supported integration. Nothing leaves without your say-so.' },
  { key: 'learn', kanji: '学習', reading: 'Learning', title: 'Learn', body: 'See which replies and posts earned a response, and where your audience is most active.' },
];

export type RadarPost = {
  id: string;
  platform: 'X' | 'Reddit';
  where: string;
  age: string;
  text: string;
  tags: string[];
  base: number;
  intent: string;
  why: string;
  draft: string;
};

/** Sample conversations for the live demo. Written for illustration. */
export const RADAR_POOL: RadarPost[] = [
  {
    id: 'a', platform: 'Reddit', where: 'r/SaaS', age: '9m',
    text: 'Is there a tool that finds threads where people are asking for recommendations? Searching by hand eats my mornings.',
    tags: ['recommendations', 'social listening', 'reddit marketing'], base: 72, intent: 'Asking for a tool',
    why: 'Asks directly for a recommendation in your category and describes the pain you solve.',
    draft: 'Same problem here. What helped: search for the phrases people use when they’re stuck — “any recommendations for”, “alternative to” — instead of your category name. That’s where the intent is.',
  },
  {
    id: 'b', platform: 'X', where: '@buildinpublic_jo', age: '24m',
    text: 'Looking for an alternative to our social listening setup. It flags everything except the people who actually want to buy.',
    tags: ['alternative to', 'social listening'], base: 70, intent: 'Comparing options',
    why: 'Actively evaluating alternatives, with a specific complaint you can speak to.',
    draft: 'Most listening tools match keywords, not intent. Filtering for questions and complaints — rather than mentions — cut our noise by a lot. Happy to share how we set it up.',
  },
  {
    id: 'c', platform: 'Reddit', where: 'r/smallbusiness', age: '1h',
    text: 'Any recommendations for bookkeeping software that doesn’t need an accountant to set up?',
    tags: ['recommendations', 'bookkeeping'], base: 66, intent: 'Asking for a tool',
    why: 'Clear request with a constraint — an easy place to be genuinely helpful.',
    draft: 'Look for one that imports bank feeds automatically and categorises as you go — setup should take an afternoon, not an accountant. Check whether it exports cleanly for tax season, too.',
  },
  {
    id: 'd', platform: 'X', where: '@indie_maya', age: '2h',
    text: 'How do you all do reddit marketing without getting banned? Every post I make gets removed.',
    tags: ['reddit marketing'], base: 61, intent: 'Seeking advice',
    why: 'A how-to question where experience is valued over promotion.',
    draft: 'Lead with answers, not links. Spend a week replying to questions in the subreddit before you post anything of your own — moderators notice who contributes.',
  },
  {
    id: 'e', platform: 'Reddit', where: 'r/startups', age: '3h',
    text: 'Founders: how do you decide which conversations are worth replying to? I can’t answer everything.',
    tags: ['social listening', 'engagement'], base: 58, intent: 'Seeking advice',
    why: 'Discussion question that fits a thoughtful, non-promotional answer.',
    draft: 'I use three filters: are they asking for help, are they in my audience, and can I add something specific? If any answer is no, I skip it.',
  },
  {
    id: 'f', platform: 'X', where: '@growthnotes', age: '5h',
    text: 'Hot take: scheduling tools made social media worse. Nobody replies anymore, everyone just broadcasts.',
    tags: ['engagement', 'scheduling'], base: 49, intent: 'Opinion',
    why: 'An opinion thread — worth joining only if you have a real point of view.',
    draft: 'Agree with half of this. Scheduling is fine for posts; the mistake is treating replies the same way. Conversations can’t be queued.',
  },
];

export const RADAR_SUGGESTIONS = ['recommendations', 'alternative to', 'social listening', 'reddit marketing', 'bookkeeping'];

export type Personality = {
  key: string;
  name: string;
  image: string;
  stance: string;
  description: string;
  sample: string;
};

export const PERSONALITY_PROMPT =
  'How are you all finding threads where people are actually asking for a tool like yours? I spend an hour a day searching.';

export const PERSONALITIES: Personality[] = [
  { key: 'strategist', name: 'Strategist', image: '/brand/p-strategist.webp', stance: 'Analytical, long-term', description: 'Lays out a system before suggesting anything. For founders building authority over months.', sample: 'Treat it as a pipeline, not a search. Pick 10–15 phrases people use when they’re stuck, check them daily, and only reply where you can add something specific.' },
  { key: 'hunter', name: 'Hunter', image: '/brand/p-hunter.webp', stance: 'Opportunity-focused', description: 'Finds the threads with real intent and gets to the point fast.', sample: 'Search for the problem, not your category. “Any recommendations for…” surfaces buyers. Reply early — the first useful answers get read.' },
  { key: 'creator', name: 'Creator', image: '/brand/p-creator.webp', stance: 'Expressive, original', description: 'Turns conversations into ideas for original posts and stories.', sample: 'Every one of those threads is a post idea. Save the questions you see three times a week — that’s your content calendar, written by your audience.' },
  { key: 'warrior', name: 'Warrior', image: '/brand/p-warrior.webp', stance: 'Bold, direct', description: 'Takes a clear position and says it with confidence.', sample: 'Stop searching by hand. An hour a day is five hours a week you’re not building. Set your keywords once and spend that time on the replies.' },
  { key: 'sensei', name: 'Sensei', image: '/brand/p-sensei.webp', stance: 'Educational, patient', description: 'Explains and teaches, leaving people better informed.', sample: 'Search the words your customers use, not the words you use. Then read the whole thread before replying — the best opening is the question nobody answered.' },
  { key: 'ronin', name: 'Ronin', image: '/brand/p-ronin.webp', stance: 'Independent, adaptable', description: 'Relaxed and conversational, with an unconventional angle.', sample: 'Honestly? I stopped hunting for “my” threads. I hang out in three subreddits, answer what I know, and the right people find me.' },
];

export type Capability = { name: string; does: string; status: 'Preview' | 'Prototype' | 'In development' };

export const CAPABILITIES: Capability[] = [
  { name: 'Opportunity discovery', does: 'Finds relevant conversations from your keywords, topics and business context.', status: 'Preview' },
  { name: 'Opportunity scoring', does: 'Ranks each conversation and explains why it was picked.', status: 'Preview' },
  { name: 'Reply Studio', does: 'Drafts context-aware replies; switch tone, regenerate or rewrite.', status: 'Preview' },
  { name: 'Brand voice', does: 'Keeps drafts aligned with your product, audience and tone.', status: 'Preview' },
  { name: 'Samurai personalities', does: 'Six engagement styles that shape how drafts are written.', status: 'Preview' },
  { name: 'Post generation', does: 'Original tweets, threads and Reddit posts from your brand context.', status: 'Preview' },
  { name: 'Analytics', does: 'Replies published, engagement earned and what’s working.', status: 'Preview' },
  { name: 'Automations', does: 'Scheduled monitoring, alerts and draft preparation. Publishing still waits for you.', status: 'Preview' },
  { name: 'Arena', does: 'A 60-second daily challenge that earns credits.', status: 'Prototype' },
  { name: 'X and Reddit connections', does: 'Sign in with your accounts to discover and publish for real.', status: 'In development' },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  { q: 'What is SocialSamurai?', a: 'An AI-powered social command center. It finds conversations on X and Reddit that match your business, shows which ones are worth joining, and drafts replies in your voice for you to approve.' },
  { q: 'Which platforms does it support?', a: 'X and Reddit. We don’t list an integration until it works.' },
  { q: 'How does discovery work?', a: 'You add keywords and topics. SocialSamurai looks for matching conversations and scores them on relevance, intent, audience fit, engagement and recency. Live discovery is in development; the preview uses sample conversations.' },
  { q: 'Can the AI publish without my approval?', a: 'No. Every reply and post stays a draft until you approve it — including anything prepared by automations.' },
  { q: 'What are Samurai personalities?', a: 'Six writing styles — Strategist, Hunter, Creator, Warrior, Sensei and Ronin. Pick one for your brand and still adjust the tone of any single reply.' },
  { q: 'What is the Arena?', a: 'An optional 60-second challenge that earns credits. An early version is playable in the preview; final rules and rewards are still being designed.' },
  { q: 'How do credits work?', a: 'Credits are planned as the measure of AI usage, such as discovering opportunities and generating drafts. Allowances will be confirmed before launch.' },
  { q: 'Who is it for?', a: 'Founders, SaaS teams, indie hackers, creators, marketers and agencies who grow by joining conversations, not just scheduling posts.' },
  { q: 'Can I change my brand voice?', a: 'Yes. Update your product, audience, keywords and voice any time; new drafts use the latest version.' },
  { q: 'Is there a free plan?', a: 'No free plan has been announced. Proposed pricing is $19 a month or $140 a year. The interactive preview is free to explore today.' },
];

import { SamuraiArchetype } from '../types';

export const SAMURAI_ARCHETYPES: SamuraiArchetype[] = [
  {
    id: 'hunter',
    name: 'The Hunter',
    title: 'Direct · Opportunistic · Fast',
    tagline: 'Strikes the moment an opportunity opens.',
    color: '#E3262E',
    accentColor: '#FF4D55',
    weapon: 'Dual Shigure Katana',
    avatarUrl: '/avatars/hunter.png',
    aiPersonality: {
      traits: ['Direct', 'Confident', 'Concise', 'Opportunity-focused'],
      description:
        'The Hunter cuts through noise instantly. Never wastes words, zeroes in on buying intent, and presents high-conviction value propositions in 2-3 razor-sharp sentences.',
      toneDefault: 'Concise',
      promptDirective:
        'Adopt The Hunter persona: Be direct, razor-sharp, concise, confident, and opportunity-focused. Deliver high value in minimal words without generic pleasantries.',
    },
    gameplayIdentity: {
      archetype: 'Assassin / Dual Striker',
      specialAbility: 'Shadow Dash & Critical Surge',
      specialDescription: 'Instantly teleports behind target, guaranteeing 100% Critical Damage on next 3 attacks.',
      stats: {
        speed: 5,
        damage: 3,
        defense: 2,
        critical: 5,
        utility: 3,
      },
    },
  },
  {
    id: 'strategist',
    name: 'The Strategist',
    title: 'Thoughtful · Analytical · Precise',
    tagline: 'Deconstructs problems with methodical precision.',
    color: '#3B82F6',
    accentColor: '#60A5FA',
    weapon: 'Tactical Nodachi & War Fan',
    avatarUrl: '/avatars/strategist.png',
    aiPersonality: {
      traits: ['Analytical', 'Structured', 'Evidence-driven', 'Calm'],
      description:
        'The Strategist dissects complex technical hurdles, providing structured frameworks, benchmarks, and deep domain analysis that establishes unassailable authority.',
      toneDefault: 'Technical',
      promptDirective:
        'Adopt The Strategist persona: Provide structured, analytical, evidence-driven insights. Focus on architecture, logic, frameworks, and practical breakdowns.',
    },
    gameplayIdentity: {
      archetype: 'Tactician / Area Control',
      specialAbility: 'Tactical EMP & Frost Nova',
      specialDescription: 'Freezes all enemies within radius for 3 seconds and increases party damage by 40%.',
      stats: {
        speed: 3,
        damage: 3,
        defense: 3,
        critical: 3,
        utility: 5,
      },
    },
  },
  {
    id: 'creator',
    name: 'The Creator',
    title: 'Creative · Conversational · Expressive',
    tagline: 'Transforms cold interactions into vibrant relationships.',
    color: '#8B5CF6',
    accentColor: '#A78BFA',
    weapon: 'Twin Chained Sickles (Kusarigama)',
    avatarUrl: '/avatars/creator.png',
    aiPersonality: {
      traits: ['Creative', 'Energetic', 'Conversational', 'Expressive'],
      description:
        'The Creator connects with storytelling, memorable metaphors, and high-energy dialogue that makes founders and creators want to follow and collaborate.',
      toneDefault: 'Casual',
      promptDirective:
        'Adopt The Creator persona: Be conversational, engaging, authentic, and creative. Use engaging analogies and build genuine camaraderie.',
    },
    gameplayIdentity: {
      archetype: 'Combo Virtuoso / High Momentum',
      specialAbility: 'Spirit Whirlwind',
      specialDescription: 'Spins in a furious blade storm, pulling in surrounding foes and ramping combo multiplier up to 10×.',
      stats: {
        speed: 4,
        damage: 4,
        defense: 2,
        critical: 4,
        utility: 4,
      },
    },
  },
  {
    id: 'warrior',
    name: 'The Warrior',
    title: 'Bold · Confident · Opinionated',
    tagline: 'Dominates the battlefield with fearless convictions.',
    color: '#F59E0B',
    accentColor: '#FBBF24',
    weapon: 'Heavy Dragon-Bane Kanabo',
    avatarUrl: '/avatars/warrior.png',
    aiPersonality: {
      traits: ['Bold', 'Decisive', 'Confident', 'Strong opinions'],
      description:
        'The Warrior takes clear stances, challenges lazy consensus, and sparks high-engagement debates by articulating strong opinions backed by battle-tested experience.',
      toneDefault: 'Bold',
      promptDirective:
        'Adopt The Warrior persona: Be bold, unapologetic, decisive, and thought-provoking. Challenge status quo assumptions with conviction.',
    },
    gameplayIdentity: {
      archetype: 'Heavy Juggernaut / High Poise',
      specialAbility: 'Earthshaker Quake',
      specialDescription: 'Slams weapon into the ground, creating a lethal shockwave that stuns and obliterates enemy armor.',
      stats: {
        speed: 2,
        damage: 5,
        defense: 4,
        critical: 2,
        utility: 3,
      },
    },
  },
  {
    id: 'sensei',
    name: 'The Sensei',
    title: 'Calm · Helpful · Experienced',
    tagline: 'Guides peers through wisdom and master craftsmanship.',
    color: '#10B981',
    accentColor: '#34D399',
    weapon: 'Elder Bamboo Staff & Bokken',
    avatarUrl: '/avatars/sensei.png',
    aiPersonality: {
      traits: ['Patient', 'Educational', 'Balanced', 'Professional'],
      description:
        'The Sensei mentors founders and builders with calm clarity. Answers questions thoroughly, provides actionable step-by-step guidance, and builds deep long-term trust.',
      toneDefault: 'Educational',
      promptDirective:
        'Adopt The Sensei persona: Be patient, educational, respectful, and deeply insightful. Teach and elevate the conversation with seasoned wisdom.',
    },
    gameplayIdentity: {
      archetype: 'Parry Master / Guardian',
      specialAbility: 'Zen Aegis & Perfect Counter',
      specialDescription: 'Deflects 100% incoming attacks for 4 seconds, converting blocked damage into health and energy waves.',
      stats: {
        speed: 3,
        damage: 3,
        defense: 5,
        critical: 2,
        utility: 4,
      },
    },
  },
  {
    id: 'ronin',
    name: 'The Ronin',
    title: 'Independent · Unfiltered · Contrarian',
    tagline: 'Follows no master. Breaks the social mold.',
    color: '#EC4899',
    accentColor: '#F472B6',
    weapon: 'Weathered Naginata & Concealed Dagger',
    avatarUrl: '/avatars/ronin.png',
    aiPersonality: {
      traits: ['Unconventional', 'Independent', 'Provocative', 'Contrarian'],
      description:
        'The Ronin rejects boring playbooks. Questions the hype, exposes overlooked pitfalls, and brings refreshing authenticity that stands out in cookie-cutter feeds.',
      toneDefault: 'Contrarian',
      promptDirective:
        'Adopt The Ronin persona: Be unconventional, sharp, unfiltered, and contrarian. Offer an unexpected angle that breaks common echo chambers.',
    },
    gameplayIdentity: {
      archetype: 'Wild Card / Risk-Reward',
      specialAbility: 'Blood Moon Surge',
      specialDescription: 'Sacrifices 15% current HP to gain +100% attack speed and life-steal for 6 seconds.',
      stats: {
        speed: 4,
        damage: 5,
        defense: 1,
        critical: 5,
        utility: 2,
      },
    },
  },
];

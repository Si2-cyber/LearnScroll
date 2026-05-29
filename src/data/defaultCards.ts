/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card } from '../types';

export const DEFAULT_CARDS: Card[] = [
  {
    id: 'seed-atomic-habits',
    title: 'Atomic Habits: The 1% Rule',
    category: 'Book summaries',
    paragraphs: [
      'James Clear argues that massive success is not driven by single, monumental shifts, but by compounding tiny 1% daily improvements.',
      'To build a lasting habit, structure your environment so clean cues are obvious, positive actions are attractive, easy to start, and immediately satisfying.',
      'Conversely, to break a bad habit, reverse these laws: make the negative cue completely invisible, unattractive, difficult to execute, and unsatisfying.'
    ],
    takeaway: 'Focus on designing systems of steady compounding habits, rather than relying on sheer willpower or aiming for sudden goals.',
    hashtags: ['Habits', 'SelfImprovement', 'Productivity'],
    backgroundColor: '#1E293B', // Slate dark
    channelName: 'BookWinds',
    likesCount: 342,
    commentsCount: 18
  },
  {
    id: 'seed-sky-blue',
    title: 'Why is the Sky Blue?',
    category: 'Trivia & fun facts',
    paragraphs: [
      'Sunlight reaches Earth\'s atmosphere and is scattered in all directions by the gases and particles suspended in the air.',
      'Shorter wavelengths (blue and violet) are scattered much more than other colors because they travel in smaller, shorter waves — a process called Rayleigh scattering.',
      'Although violet light has an even shorter wavelength than blue, the sky looks blue because our eyes are highly sensitive to blue and because sunlight contains more blue light.'
    ],
    takeaway: 'Rayleigh scattering causes short blue lightwaves to scatter wildly across our atmosphere, painting our dome blue.',
    hashtags: ['Physics', 'Atmosphere', 'ScienceFacts'],
    backgroundColor: '#0F172A', // Darker blue slate
    channelName: 'NatureLab',
    likesCount: 520,
    commentsCount: 42
  },
  {
    id: 'seed-stoicism',
    title: 'Marcus Aurelius & The Dichotomy of Control',
    category: 'Philosophy & quotes',
    paragraphs: [
      'At the core of Stoic philosophy is the Dichotomy of Control: separating all occurrences in life into things you control, and things you do not.',
      'Things under your total control include your thoughts, beliefs, impulses, desires, and your deliberate reactions to external events.',
      'Everything else — your reputation, your health, wealth, past events, and other people\'s actions — falls entirely outside your absolute control.'
    ],
    takeaway: 'Save your intellectual energy: invest fully in your own choices, and practice radical acceptance toward what you cannot control.',
    hashtags: ['Stoicism', 'Philosophy', 'MentalClarity'],
    backgroundColor: '#111827', // Obsidian dark
    channelName: 'WiseMind',
    likesCount: 418,
    commentsCount: 29
  },
  {
    id: 'seed-finance-rule',
    title: 'The 50/30/20 Budgeting Principle',
    category: 'Life skills & how-to tips',
    paragraphs: [
      'The 50/30/20 rule is a straightforward, reliable structure to allocate your monthly after-tax income into clear, manageable buckets.',
      'Allocate exactly 50% toward absolute needs (housing, food, utilities, insurances). This forms your non-negotiable living baseline.',
      'Dedicate 30% to personal wants (dining out, subscriptions, leisure), and allocate the remaining 20% directly into savings, investments, or debt paydown.'
    ],
    takeaway: 'Divide your income into Needs (50%), Wants (30%), and Future Savings (20%) to build automated financial durability.',
    hashtags: ['PersonalFinance', 'LifeSkills', 'Budgeting'],
    backgroundColor: '#14532B', // Dark spruce green
    channelName: 'WealthFlow',
    likesCount: 289,
    commentsCount: 15
  },
  {
    id: 'seed-pomodoro',
    title: 'The Pomodoro & Ultradian Rhythm',
    category: 'Study & focus tips',
    paragraphs: [
      'Developed by Francesco Cirillo, the Pomodoro Technique involves breaking your work into intense, uninterrupted 25-minute sprints followed by a 5-minute pause.',
      'This rhythm leverages our biological ultradian cycles, which dictate that our brains can only maintain peak focus for 90 to 120 minutes before requiring rest.',
      'Every four sprints, step away for a deeper 15-to-30-minute systemic recovery period to flush away metabolic waste and reset cognitive capacity.'
    ],
    takeaway: 'Protect focus by scheduling high-intensity deep work sprints paired with intentional, screen-free micro-breaks.',
    hashtags: ['DeepWork', 'FocusTips', 'BrainHealth'],
    backgroundColor: '#3F1A1B', // Dark maroon-rust
    channelName: 'FocusLabs',
    likesCount: 611,
    commentsCount: 31
  },
  {
    id: 'seed-tardigrades',
    title: 'The Indestructible Tardigrade',
    category: 'Science & nature facts',
    paragraphs: [
      'Tardigrades, or "water bears," are eight-legged microscopic animals famous for surviving conditions that would immediately vaporize most organisms.',
      'When faced with high radiation, boiling heat, absolute zero, or the vacuum of space, they enter "cryptobiosis," expelling 97% of their body\'s water.',
      'They retract their limbs and suspend their metabolic processes completely, creating a protective glass-like sugar bubble around their cells.'
    ],
    takeaway: 'Water bears can suspend their metabolism almost indefinitely to endure extreme cosmic hazards, waking up perfectly healthy later.',
    hashtags: ['Biology', 'SpaceScience', 'AmazingNature'],
    backgroundColor: '#1E1B4B', // Dark indigo-violet
    channelName: 'BioSphere',
    likesCount: 840,
    commentsCount: 56
  },
  {
    id: 'seed-music-focus',
    title: 'The Science of Focus Playlists',
    category: 'Music recommendations',
    paragraphs: [
      'Neuroscientific studies reveal that lyrics in music activate the language hubs of your brain, competing with the verbal tasks you are doing.',
      'For peak mental throughput, listen to steady, non-vocal audio such as ambient modular synthesizers, classical Baroque music, or cinematic scores.',
      'Steady, repetitive rhythms around 60–80 BPM help synchronize brain waves into a focused, highly productive alpha state.'
    ],
    takeaway: 'Listen to non-lyrical, 60–80 BPM instrumental background music to stabilize your attention and transition into a flow state.',
    hashtags: ['MusicScience', 'FocusFlow', 'LofiFlow'],
    backgroundColor: '#2D0B3D', // Deep purple
    channelName: 'SoundWave',
    likesCount: 375,
    commentsCount: 22
  },
  {
    id: 'seed-alexandria-library',
    title: 'The Great Library of Alexandria',
    category: 'History highlights',
    paragraphs: [
      'The Library of Alexandria in Egypt was the ancient world\'s premier research center, housing hundreds of thousands of papyrus scrolls.',
      'To build the archive, Egyptian authorities seized scrolls off every incoming ship, copied them, kept the originals, and returned the copies.',
      'Its decline was not a single dramatic fire, but a slow process of underfunding, civil wars, and shifting imperial priorities over centuries.'
    ],
    takeaway: 'The library was built by aggressively acquiring other nations\' original manuscripts and suffered a steady decline over centuries.',
    hashtags: ['History', 'AncientWorld', 'LibraryScience'],
    backgroundColor: '#2F1E0E', // Dark sepia/brown
    channelName: 'Chronicles',
    likesCount: 494,
    commentsCount: 43
  },
  {
    id: 'seed-japanese-kintsugi',
    title: 'Kintsugi: The Beauty of Scars',
    category: 'Language learning snippets',
    paragraphs: [
      'Kintsugi (金継ぎ) literally translates from Japanese to "golden joinery" or "to repair with gold."',
      'It is the ancient art of repairing broken pottery using liquid lacquer mixed with powdered precious metals such as gold, silver, or platinum.',
      'Philosophy-wise, it emphasizes Wabi-Sabi: accepting imperfections, valuing history, and viewing the fracture as a beautiful highlight rather than a flaw.'
    ],
    takeaway: 'Kintsugi teaches us not to hide our history or hardships, but to wear our repaired fractures with pride and visual grace.',
    hashtags: ['JapanesePhilosophy', 'Kintsugi', 'ArtWisdom'],
    backgroundColor: '#0D3E3A', // Deep teal
    channelName: 'WordVoyage',
    likesCount: 512,
    commentsCount: 38
  },
  {
    id: 'seed-quantum-physics',
    title: 'Quantum Entanglement: Spooky Action',
    category: 'Science & nature facts',
    paragraphs: [
      'When two subatomic particles become entangled, their physical properties like spin or polarization become perfectly linked.',
      'Measuring the state of one particle instantly determines the state of its partner, regardless of whether they are separated by centimeters or lightyears.',
      'Albert Einstein famously doubted this finding, mockingly calling it "spooky action at a distance" because it challenged classical space limits.'
    ],
    takeaway: 'Information between entangled particles transfers instantly, revealing deep, non-local mechanics at the quantum foundation.',
    hashtags: ['QuantumPhysics', 'ScienceFact', 'Astrophysics'],
    backgroundColor: '#1E293B', // Deep Slate Blue
    channelName: 'MicroCosm',
    likesCount: 654,
    commentsCount: 47
  }
];

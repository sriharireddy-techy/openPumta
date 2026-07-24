export type SlideMode = 'full' | 'tour';

export interface OnboardingSlide {
  id: string;
  mode: SlideMode;
  title: string;
  subtitle?: string;
  body: string[];
  caption?: string;
  illustration:
    | 'flow'
    | 'subjects'
    | 'habits'
    | 'workspace'
    | 'analytics'
    | 'dailyreview'
    | 'export'
    | 'opensource';
  cta: string;
  // For tour mode: where to navigate + what to highlight
  route?: string;
  highlightTarget?: string;
  tourLabel?: string; // short one-liner shown in compact card
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    mode: 'full',
    title: 'Welcome to OpenPumta',
    subtitle: 'A system for deliberate practice and long-term skill development.',
    body: [
      'Track what you study. Build habits that support it.',
      'Plan your work. Journal. Reflect on your progress.',
      'Understand your patterns.',
    ],
    illustration: 'flow',
    cta: 'Get Started',
  },
  {
    id: 'subjects',
    mode: 'tour',
    title: "Track What You're Actually Learning",
    body: [
      'This is where you add subjects.',
      'Hit Continue when you are ready to add your first one.',
    ],
    illustration: 'subjects',
    cta: 'Continue',
    route: '/',
    highlightTarget: 'subjects-section',
    tourLabel: 'Hit Continue to keep going. You can add subjects after the tour.',
  },
  {
    id: 'habits',
    mode: 'tour',
    title: 'Build Systems, Not Motivation',
    body: [
      'This is where you add daily habits.',
      'Hit Continue when you are ready to add your first one.',
    ],
    caption: 'Small actions compound.',
    illustration: 'habits',
    cta: 'Continue',
    route: '/',
    highlightTarget: 'habits-section',
    tourLabel: 'Hit Continue when you are ready to add your first habit.',
  },
  {
    id: 'workspace',
    mode: 'tour',
    title: 'Turn Goals Into Action',
    body: [
      'This is where you create workspaces.',
      'Hit Continue when you are ready to add your first one.',
    ],
    illustration: 'workspace',
    cta: 'Continue',
    route: '/todo',
    highlightTarget: 'workspace-page',
    tourLabel: 'Hit Continue when you are ready to create a space.',
  },
  {
    id: 'analytics',
    mode: 'tour',
    title: 'Understand Your Patterns',
    body: [
      'Most apps stop at streaks. OpenPumta goes further.',
      'Focus trends, consistency, weekly patterns, goal vs reality.',
    ],
    illustration: 'analytics',
    cta: 'Continue',
    route: '/stats',
    highlightTarget: 'stats-page',
    tourLabel: 'Deep analytics reveal patterns over time.',
  },
  {
    id: 'dailyreview',
    mode: 'tour',
    title: 'Reflect and Improve',
    body: [
      'End each day by rating your focus and journaling your thoughts.',
      'See your 21-day history and track long-term progress.',
    ],
    illustration: 'dailyreview',
    cta: 'Continue',
    route: '/',
    highlightTarget: 'daily-review-section',
    tourLabel: 'Reflect daily. Your reviews live here.',
  },
  {
    id: 'export',
    mode: 'tour',
    title: 'Your Data Belongs To You',
    body: [
      'Export everything whenever you want.',
      'No lock-in. No hidden ownership. Your history is yours — forever.',
    ],
    illustration: 'export',
    cta: 'Continue',
    route: '/settings',
    highlightTarget: 'export-section',
    tourLabel: 'Export your data anytime from Settings.',
  },
  {
    id: 'opensource',
    mode: 'full',
    title: 'Built In Public',
    body: [
      'OpenPumta is open source.',
      'Inspect the code. Suggest improvements. Report issues. Submit pull requests.',
      'Your feedback is always appreciated.',
    ],
    illustration: 'opensource',
    cta: 'Finish Setup',
  },
];

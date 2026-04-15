export type Beat = { startFrame: number; endFrame: number; text: string };

export type SceneType =
  | "hero-word"
  | "origin-chain"
  | "meaning-compare"
  | "emoji-storyboard"
  | "profile-story"
  | "full-screen-mood"
  | "ending-summary"
  | "quote-page"
  | "timeline-page"
  | "answer-cards";

export type SceneConfig =
  | { type: "hero-word"; props: HeroWordProps; beats: Beat[] }
  | { type: "origin-chain"; props: OriginChainProps; beats: Beat[] }
  | { type: "meaning-compare"; props: MeaningCompareProps; beats: Beat[] }
  | { type: "emoji-storyboard"; props: EmojiStoryboardProps; beats: Beat[] }
  | { type: "profile-story"; props: ProfileStoryProps; beats: Beat[] }
  | { type: "full-screen-mood"; props: FullScreenMoodProps; beats: Beat[] }
  | { type: "ending-summary"; props: EndingSummaryProps; beats: Beat[] }
  | { type: "quote-page"; props: QuotePageProps; beats: Beat[] }
  | { type: "timeline-page"; props: TimelinePageProps; beats: Beat[] }
  | { type: "answer-cards"; props: AnswerCardsProps; beats: Beat[] };

export type WordConfig = {
  word: string;
  title: string;
  theme?: string;
  fps: number;
  audioPrefix: string;
  scenes: SceneConfig[];
};

// Props for each scene type
export type HeroWordProps = {
  word: string;
  subtitle: string;
  tags: string[];
};

export type OriginChainProps = {
  title: string;
  kicker: string;
  nodes: { label: string; note: string; color?: string }[];
  arrowLabel: string;
};

export type MeaningCompareProps = {
  title: string;
  kicker: string;
  leftLabel: string;
  leftNote: string;
  rightLabel: string;
  rightNote: string;
  bottomText: string;
};

export type EmojiStoryboardProps = {
  title: string;
  kicker: string;
  storyItems: { text: string; emoji: string; emojiLabel: string; emojiColor?: string }[];
  highlight: string;
};

export type ProfileStoryProps = {
  title: string;
  kicker: string;
  storyLines: string[];
  highlight: string;
};

export type FullScreenMoodProps = {
  title: string;
  kicker: string;
  moodLines: string[];
  centerEmoji: string;
  bottomQuote: string;
};

export type EndingSummaryProps = {
  title: string;
  kicker: string;
  formula: string;
  points: { text: string; color?: string }[];
  closing: string;
};

export type QuotePageProps = {
  title: string;
  kicker: string;
  quote: string;
  author: string;
  context: string;
};

export type TimelinePageProps = {
  title: string;
  kicker: string;
  events: { year: string; label: string; desc: string }[];
};

export type AnswerCardsProps = {
  title: string;
  kicker: string;
  question: string;
  cards: {
    number: string;
    icon: string;
    headline: string;
    body: string;
    color?: string;
  }[];
};

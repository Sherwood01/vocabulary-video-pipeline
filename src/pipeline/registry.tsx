import React from "react";
import {
  HeroWordPage,
  OriginChainPage,
  MeaningClusterPage,
  StoryIllustrationPage,
  ProfileStoryPage,
  FullScreenMoodPage,
  EndingSummaryPage,
} from "../vocabHybrid/components";
import { QuotePage } from "../vocabHybrid/QuotePage";
import { TimelinePage } from "../vocabHybrid/TimelinePage";
import { AnswerCardsPage } from "../vocabHybrid/AnswerCardsPage";
import { SceneConfig } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCENE_REGISTRY: Record<SceneConfig["type"], React.FC<any>> = {
  "hero-word": HeroWordPage,
  "origin-chain": OriginChainPage,
  "meaning-compare": MeaningClusterPage,
  "emoji-storyboard": StoryIllustrationPage,
  "profile-story": ProfileStoryPage,
  "full-screen-mood": FullScreenMoodPage,
  "ending-summary": EndingSummaryPage,
  "quote-page": QuotePage,
  "timeline-page": TimelinePage,
  "answer-cards": AnswerCardsPage,
};

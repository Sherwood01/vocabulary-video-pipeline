import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import comprehensiveConfig from "../data/comprehensive-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ComprehensiveWordVideo: React.FC = () => {
  return <WordVideoPlayer config={comprehensiveConfig as WordConfig} />;
};

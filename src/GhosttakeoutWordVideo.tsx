import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import ghosttakeoutConfig from "../data/ghosttakeout-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const GhosttakeoutWordVideo: React.FC = () => {
  return <WordVideoPlayer config={ghosttakeoutConfig as WordConfig} />;
};

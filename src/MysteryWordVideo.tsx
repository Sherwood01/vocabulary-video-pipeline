import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import mysteryConfig from "../data/mystery-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MysteryWordVideo: React.FC = () => {
  return <WordVideoPlayer config={mysteryConfig as WordConfig} />;
};

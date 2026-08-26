import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import diminutiveConfig from "../data/diminutive-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DiminutiveWordVideo: React.FC = () => {
  return <WordVideoPlayer config={diminutiveConfig as WordConfig} />;
};

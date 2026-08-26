import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import soulmateConfig from "../data/soulmate-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SoulmateWordVideo: React.FC = () => {
  return <WordVideoPlayer config={soulmateConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import fondnessConfig from "../data/fondness-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const FondnessWordVideo: React.FC = () => {
  return <WordVideoPlayer config={fondnessConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import solutionConfig from "../data/solution-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SolutionWordVideo: React.FC = () => {
  return <WordVideoPlayer config={solutionConfig as WordConfig} />;
};

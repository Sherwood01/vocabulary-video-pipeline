import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import accomplishedConfig from "../data/accomplished-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AccomplishedWordVideo: React.FC = () => {
  return <WordVideoPlayer config={accomplishedConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import breakfastConfig from "../data/breakfast-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const BreakfastWordVideo: React.FC = () => {
  return <WordVideoPlayer config={breakfastConfig as WordConfig} />;
};

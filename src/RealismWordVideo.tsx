import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import realismConfig from "../data/realism-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const RealismWordVideo: React.FC = () => {
  return <WordVideoPlayer config={realismConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import cumulativeConfig from "../data/cumulative-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CumulativeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={cumulativeConfig as WordConfig} />;
};

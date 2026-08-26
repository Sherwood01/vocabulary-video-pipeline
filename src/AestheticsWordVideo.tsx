import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import aestheticsConfig from "../data/aesthetics-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AestheticsWordVideo: React.FC = () => {
  return <WordVideoPlayer config={aestheticsConfig as WordConfig} />;
};

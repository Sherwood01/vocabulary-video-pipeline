import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import melodicConfig from "../data/melodic-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MelodicWordVideo: React.FC = () => {
  return <WordVideoPlayer config={melodicConfig as WordConfig} />;
};

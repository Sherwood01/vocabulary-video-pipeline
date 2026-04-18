import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import spacewalkConfig from "../data/spacewalk-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SpacewalkWordVideo: React.FC = () => {
  return <WordVideoPlayer config={spacewalkConfig as WordConfig} />;
};

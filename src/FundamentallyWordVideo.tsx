import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import fundamentallyConfig from "../data/fundamentally-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const FundamentallyWordVideo: React.FC = () => {
  return <WordVideoPlayer config={fundamentallyConfig as WordConfig} />;
};

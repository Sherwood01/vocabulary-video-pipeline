import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import intimateConfig from "../data/intimate-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const IntimateWordVideo: React.FC = () => {
  return <WordVideoPlayer config={intimateConfig as WordConfig} />;
};

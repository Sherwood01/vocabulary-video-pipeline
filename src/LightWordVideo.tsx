import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import lightConfig from "../data/light-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const LightWordVideo: React.FC = () => {
  return <WordVideoPlayer config={lightConfig as WordConfig} />;
};

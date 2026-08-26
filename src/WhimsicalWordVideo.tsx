import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import whimsicalConfig from "../data/whimsical-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const WhimsicalWordVideo: React.FC = () => {
  return <WordVideoPlayer config={whimsicalConfig as WordConfig} />;
};

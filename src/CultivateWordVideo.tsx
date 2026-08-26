import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import cultivateConfig from "../data/cultivate-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CultivateWordVideo: React.FC = () => {
  return <WordVideoPlayer config={cultivateConfig as WordConfig} />;
};

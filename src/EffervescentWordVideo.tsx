import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import effervescentConfig from "../data/effervescent-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EffervescentWordVideo: React.FC = () => {
  return <WordVideoPlayer config={effervescentConfig as WordConfig} />;
};

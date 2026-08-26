import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import equanimityConfig from "../data/equanimity-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EquanimityWordVideo: React.FC = () => {
  return <WordVideoPlayer config={equanimityConfig as WordConfig} />;
};

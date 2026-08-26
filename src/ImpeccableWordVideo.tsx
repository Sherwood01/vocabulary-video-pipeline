import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import impeccableConfig from "../data/impeccable-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ImpeccableWordVideo: React.FC = () => {
  return <WordVideoPlayer config={impeccableConfig as WordConfig} />;
};

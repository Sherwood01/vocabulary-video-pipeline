import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import adoreConfig from "../data/adore-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AdoreWordVideo: React.FC = () => {
  return <WordVideoPlayer config={adoreConfig as WordConfig} />;
};

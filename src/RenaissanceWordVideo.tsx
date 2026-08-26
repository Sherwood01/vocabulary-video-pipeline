import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import renaissanceConfig from "../data/renaissance-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const RenaissanceWordVideo: React.FC = () => {
  return <WordVideoPlayer config={renaissanceConfig as WordConfig} />;
};

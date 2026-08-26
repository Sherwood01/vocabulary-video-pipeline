import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import caveatConfig from "../data/caveat-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CaveatWordVideo: React.FC = () => {
  return <WordVideoPlayer config={caveatConfig as WordConfig} />;
};

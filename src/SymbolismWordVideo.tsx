import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import symbolismConfig from "../data/symbolism-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SymbolismWordVideo: React.FC = () => {
  return <WordVideoPlayer config={symbolismConfig as WordConfig} />;
};

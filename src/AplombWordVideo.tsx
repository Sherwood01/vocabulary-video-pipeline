import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import aplombConfig from "../data/aplomb-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AplombWordVideo: React.FC = () => {
  return <WordVideoPlayer config={aplombConfig as WordConfig} />;
};

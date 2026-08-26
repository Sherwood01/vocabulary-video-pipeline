import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import brevityConfig from "../data/brevity-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const BrevityWordVideo: React.FC = () => {
  return <WordVideoPlayer config={brevityConfig as WordConfig} />;
};

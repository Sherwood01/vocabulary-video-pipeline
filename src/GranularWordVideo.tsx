import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import granularConfig from "../data/granular-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const GranularWordVideo: React.FC = () => {
  return <WordVideoPlayer config={granularConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import felicitousConfig from "../data/felicitous-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const FelicitousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={felicitousConfig as WordConfig} />;
};

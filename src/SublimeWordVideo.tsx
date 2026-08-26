import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import sublimeConfig from "../data/sublime-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SublimeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={sublimeConfig as WordConfig} />;
};

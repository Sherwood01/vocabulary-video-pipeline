import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import protagonistConfig from "../data/protagonist-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ProtagonistWordVideo: React.FC = () => {
  return <WordVideoPlayer config={protagonistConfig as WordConfig} />;
};

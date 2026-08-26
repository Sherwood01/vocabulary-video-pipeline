import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import metaphorConfig from "../data/metaphor-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MetaphorWordVideo: React.FC = () => {
  return <WordVideoPlayer config={metaphorConfig as WordConfig} />;
};

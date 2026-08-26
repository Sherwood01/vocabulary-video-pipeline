import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import gloriousConfig from "../data/glorious-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const GloriousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={gloriousConfig as WordConfig} />;
};

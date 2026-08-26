import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import nefariousConfig from "../data/nefarious-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const NefariousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={nefariousConfig as WordConfig} />;
};

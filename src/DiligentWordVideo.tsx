import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import diligentConfig from "../data/diligent-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DiligentWordVideo: React.FC = () => {
  return <WordVideoPlayer config={diligentConfig as WordConfig} />;
};

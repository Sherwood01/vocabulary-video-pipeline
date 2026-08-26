import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import allusionConfig from "../data/allusion-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AllusionWordVideo: React.FC = () => {
  return <WordVideoPlayer config={allusionConfig as WordConfig} />;
};

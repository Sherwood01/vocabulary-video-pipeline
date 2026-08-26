import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import predilectionConfig from "../data/predilection-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const PredilectionWordVideo: React.FC = () => {
  return <WordVideoPlayer config={predilectionConfig as WordConfig} />;
};

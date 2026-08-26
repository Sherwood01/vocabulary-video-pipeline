import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import qualitativeConfig from "../data/qualitative-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const QualitativeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={qualitativeConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import enraptureConfig from "../data/enrapture-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EnraptureWordVideo: React.FC = () => {
  return <WordVideoPlayer config={enraptureConfig as WordConfig} />;
};

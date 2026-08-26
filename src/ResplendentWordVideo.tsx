import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import resplendentConfig from "../data/resplendent-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ResplendentWordVideo: React.FC = () => {
  return <WordVideoPlayer config={resplendentConfig as WordConfig} />;
};

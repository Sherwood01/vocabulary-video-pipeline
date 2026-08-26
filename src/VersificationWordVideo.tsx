import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import versificationConfig from "../data/versification-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const VersificationWordVideo: React.FC = () => {
  return <WordVideoPlayer config={versificationConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import digressConfig from "../data/digress-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DigressWordVideo: React.FC = () => {
  return <WordVideoPlayer config={digressConfig as WordConfig} />;
};

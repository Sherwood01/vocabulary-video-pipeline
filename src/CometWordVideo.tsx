import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import cometConfig from "../data/comet-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CometWordVideo: React.FC = () => {
  return <WordVideoPlayer config={cometConfig as WordConfig} />;
};

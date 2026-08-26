import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import candorConfig from "../data/candor-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CandorWordVideo: React.FC = () => {
  return <WordVideoPlayer config={candorConfig as WordConfig} />;
};

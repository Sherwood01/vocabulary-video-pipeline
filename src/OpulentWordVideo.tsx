import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import opulentConfig from "../data/opulent-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const OpulentWordVideo: React.FC = () => {
  return <WordVideoPlayer config={opulentConfig as WordConfig} />;
};

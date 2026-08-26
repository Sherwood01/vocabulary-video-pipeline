import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import perniciousConfig from "../data/pernicious-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const PerniciousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={perniciousConfig as WordConfig} />;
};

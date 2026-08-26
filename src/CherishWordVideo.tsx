import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import cherishConfig from "../data/cherish-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CherishWordVideo: React.FC = () => {
  return <WordVideoPlayer config={cherishConfig as WordConfig} />;
};

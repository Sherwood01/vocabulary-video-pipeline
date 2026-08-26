import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import acquiesceConfig from "../data/acquiesce-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AcquiesceWordVideo: React.FC = () => {
  return <WordVideoPlayer config={acquiesceConfig as WordConfig} />;
};

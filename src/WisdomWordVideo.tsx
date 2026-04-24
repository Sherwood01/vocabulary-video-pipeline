import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import wisdomConfig from "../data/wisdom-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const WisdomWordVideo: React.FC = () => {
  return <WordVideoPlayer config={wisdomConfig as WordConfig} />;
};

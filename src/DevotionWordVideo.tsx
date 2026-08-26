import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import devotionConfig from "../data/devotion-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DevotionWordVideo: React.FC = () => {
  return <WordVideoPlayer config={devotionConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import intricateConfig from "../data/intricate-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const IntricateWordVideo: React.FC = () => {
  return <WordVideoPlayer config={intricateConfig as WordConfig} />;
};

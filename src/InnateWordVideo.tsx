import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import innateConfig from "../data/innate-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const InnateWordVideo: React.FC = () => {
  return <WordVideoPlayer config={innateConfig as WordConfig} />;
};

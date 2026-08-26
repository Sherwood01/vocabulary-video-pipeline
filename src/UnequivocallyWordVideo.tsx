import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import unequivocallyConfig from "../data/unequivocally-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const UnequivocallyWordVideo: React.FC = () => {
  return <WordVideoPlayer config={unequivocallyConfig as WordConfig} />;
};

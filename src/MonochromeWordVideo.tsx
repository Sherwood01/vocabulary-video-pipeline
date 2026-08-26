import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import monochromeConfig from "../data/monochrome-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MonochromeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={monochromeConfig as WordConfig} />;
};

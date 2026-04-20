import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import beautifulConfig from "../data/beautiful-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const BeautifulWordVideo: React.FC = () => {
  return <WordVideoPlayer config={beautifulConfig as WordConfig} />;
};

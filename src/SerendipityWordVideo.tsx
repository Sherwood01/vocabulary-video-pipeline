import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import serendipityConfig from "../data/serendipity-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SerendipityWordVideo: React.FC = () => {
  return <WordVideoPlayer config={serendipityConfig as WordConfig} />;
};

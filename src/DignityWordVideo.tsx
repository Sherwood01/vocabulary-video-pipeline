import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import dignityConfig from "../data/dignity-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DignityWordVideo: React.FC = () => {
  return <WordVideoPlayer config={dignityConfig as WordConfig} />;
};

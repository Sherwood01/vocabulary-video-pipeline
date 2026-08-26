import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import sonnetConfig from "../data/sonnet-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SonnetWordVideo: React.FC = () => {
  return <WordVideoPlayer config={sonnetConfig as WordConfig} />;
};

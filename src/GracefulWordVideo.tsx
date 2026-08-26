import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import gracefulConfig from "../data/graceful-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const GracefulWordVideo: React.FC = () => {
  return <WordVideoPlayer config={gracefulConfig as WordConfig} />;
};

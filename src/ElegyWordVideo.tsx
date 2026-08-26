import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import elegyConfig from "../data/elegy-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ElegyWordVideo: React.FC = () => {
  return <WordVideoPlayer config={elegyConfig as WordConfig} />;
};

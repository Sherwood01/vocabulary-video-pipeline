import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import entrancingConfig from "../data/entrancing-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EntrancingWordVideo: React.FC = () => {
  return <WordVideoPlayer config={entrancingConfig as WordConfig} />;
};

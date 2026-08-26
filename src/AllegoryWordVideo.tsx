import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import allegoryConfig from "../data/allegory-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AllegoryWordVideo: React.FC = () => {
  return <WordVideoPlayer config={allegoryConfig as WordConfig} />;
};

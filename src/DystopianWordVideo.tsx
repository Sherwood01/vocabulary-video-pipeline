import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import dystopianConfig from "../data/dystopian-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DystopianWordVideo: React.FC = () => {
  return <WordVideoPlayer config={dystopianConfig as WordConfig} />;
};

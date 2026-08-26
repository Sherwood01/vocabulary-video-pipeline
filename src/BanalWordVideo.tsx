import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import banalConfig from "../data/banal-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const BanalWordVideo: React.FC = () => {
  return <WordVideoPlayer config={banalConfig as WordConfig} />;
};

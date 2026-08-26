import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import motherConfig from "../data/mother-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MotherWordVideo: React.FC = () => {
  return <WordVideoPlayer config={motherConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import exquisiteConfig from "../data/exquisite-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ExquisiteWordVideo: React.FC = () => {
  return <WordVideoPlayer config={exquisiteConfig as WordConfig} />;
};

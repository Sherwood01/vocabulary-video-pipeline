import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import efficaciousConfig from "../data/efficacious-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EfficaciousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={efficaciousConfig as WordConfig} />;
};

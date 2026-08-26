import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import eloquentConfig from "../data/eloquent-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EloquentWordVideo: React.FC = () => {
  return <WordVideoPlayer config={eloquentConfig as WordConfig} />;
};

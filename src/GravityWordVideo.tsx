import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import gravityConfig from "../data/gravity-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const GravityWordVideo: React.FC = () => {
  return <WordVideoPlayer config={gravityConfig as WordConfig} />;
};

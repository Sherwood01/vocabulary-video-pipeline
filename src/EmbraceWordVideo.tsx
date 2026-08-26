import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import embraceConfig from "../data/embrace-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EmbraceWordVideo: React.FC = () => {
  return <WordVideoPlayer config={embraceConfig as WordConfig} />;
};

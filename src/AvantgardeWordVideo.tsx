import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import avantgardeConfig from "../data/avantgarde-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AvantgardeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={avantgardeConfig as WordConfig} />;
};

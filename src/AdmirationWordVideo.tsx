import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import admirationConfig from "../data/admiration-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AdmirationWordVideo: React.FC = () => {
  return <WordVideoPlayer config={admirationConfig as WordConfig} />;
};

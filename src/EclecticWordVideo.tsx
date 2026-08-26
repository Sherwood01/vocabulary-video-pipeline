import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import eclecticConfig from "../data/eclectic-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EclecticWordVideo: React.FC = () => {
  return <WordVideoPlayer config={eclecticConfig as WordConfig} />;
};

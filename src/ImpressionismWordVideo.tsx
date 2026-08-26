import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import impressionismConfig from "../data/impressionism-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ImpressionismWordVideo: React.FC = () => {
  return <WordVideoPlayer config={impressionismConfig as WordConfig} />;
};

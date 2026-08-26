import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import tendernessConfig from "../data/tenderness-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const TendernessWordVideo: React.FC = () => {
  return <WordVideoPlayer config={tendernessConfig as WordConfig} />;
};

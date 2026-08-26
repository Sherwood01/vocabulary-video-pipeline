import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import delightConfig from "../data/delight-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DelightWordVideo: React.FC = () => {
  return <WordVideoPlayer config={delightConfig as WordConfig} />;
};

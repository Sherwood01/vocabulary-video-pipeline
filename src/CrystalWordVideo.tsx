import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import crystalConfig from "../data/crystal-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CrystalWordVideo: React.FC = () => {
  return <WordVideoPlayer config={crystalConfig as WordConfig} />;
};

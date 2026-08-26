import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import catharsisConfig from "../data/catharsis-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CatharsisWordVideo: React.FC = () => {
  return <WordVideoPlayer config={catharsisConfig as WordConfig} />;
};

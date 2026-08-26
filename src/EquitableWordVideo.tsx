import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import equitableConfig from "../data/equitable-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EquitableWordVideo: React.FC = () => {
  return <WordVideoPlayer config={equitableConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import substantiateConfig from "../data/substantiate-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SubstantiateWordVideo: React.FC = () => {
  return <WordVideoPlayer config={substantiateConfig as WordConfig} />;
};

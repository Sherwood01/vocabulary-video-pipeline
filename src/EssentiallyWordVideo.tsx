import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import essentiallyConfig from "../data/essentially-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EssentiallyWordVideo: React.FC = () => {
  return <WordVideoPlayer config={essentiallyConfig as WordConfig} />;
};

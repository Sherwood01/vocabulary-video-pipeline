import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import scintillatingConfig from "../data/scintillating-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ScintillatingWordVideo: React.FC = () => {
  return <WordVideoPlayer config={scintillatingConfig as WordConfig} />;
};

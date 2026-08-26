import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import bespokeConfig from "../data/bespoke-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const BespokeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={bespokeConfig as WordConfig} />;
};

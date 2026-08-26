import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import immenseConfig from "../data/immense-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ImmenseWordVideo: React.FC = () => {
  return <WordVideoPlayer config={immenseConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import whispersConfig from "../data/whispers-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const WhispersWordVideo: React.FC = () => {
  return <WordVideoPlayer config={whispersConfig as WordConfig} />;
};

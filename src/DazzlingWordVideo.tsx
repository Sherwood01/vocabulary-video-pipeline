import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import dazzlingConfig from "../data/dazzling-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DazzlingWordVideo: React.FC = () => {
  return <WordVideoPlayer config={dazzlingConfig as WordConfig} />;
};

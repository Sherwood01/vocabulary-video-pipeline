import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import mellifluousConfig from "../data/mellifluous-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MellifluousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={mellifluousConfig as WordConfig} />;
};

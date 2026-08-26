import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import perspicaciousConfig from "../data/perspicacious-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const PerspicaciousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={perspicaciousConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import implicitConfig from "../data/implicit-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ImplicitWordVideo: React.FC = () => {
  return <WordVideoPlayer config={implicitConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import surrealConfig from "../data/surreal-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const SurrealWordVideo: React.FC = () => {
  return <WordVideoPlayer config={surrealConfig as WordConfig} />;
};

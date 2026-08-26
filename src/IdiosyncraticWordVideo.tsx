import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import idiosyncraticConfig from "../data/idiosyncratic-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const IdiosyncraticWordVideo: React.FC = () => {
  return <WordVideoPlayer config={idiosyncraticConfig as WordConfig} />;
};

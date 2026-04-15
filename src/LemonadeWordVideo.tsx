import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import lemonadeConfig from "../data/lemonade-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const LemonadeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={lemonadeConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import expressionismConfig from "../data/expressionism-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ExpressionismWordVideo: React.FC = () => {
  return <WordVideoPlayer config={expressionismConfig as WordConfig} />;
};

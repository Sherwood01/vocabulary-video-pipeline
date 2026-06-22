import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import type { WordConfig } from "./pipeline/types";

export const HelloWorldWordVideo: React.FC<WordConfig> = (props) => (
  <WordVideoPlayer config={props} />
);

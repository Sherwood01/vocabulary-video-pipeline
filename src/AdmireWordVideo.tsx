import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import admireConfig from "../data/admire-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AdmireWordVideo: React.FC = () => {
  return <WordVideoPlayer config={admireConfig as WordConfig} />;
};

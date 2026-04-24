import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import earthquakeConfig from "../data/earthquake-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EarthquakeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={earthquakeConfig as WordConfig} />;
};

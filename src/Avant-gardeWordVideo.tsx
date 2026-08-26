import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import avant-gardeConfig from "../data/avant-garde-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const Avant-gardeWordVideo: React.FC = () => {
  return <WordVideoPlayer config={avant-gardeConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import petrichorConfig from "../data/petrichor-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const PetrichorWordVideo: React.FC = () => {
  return <WordVideoPlayer config={petrichorConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import ephemeralConfig from "../data/ephemeral-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EphemeralWordVideo: React.FC = () => {
  return <WordVideoPlayer config={ephemeralConfig as WordConfig} />;
};

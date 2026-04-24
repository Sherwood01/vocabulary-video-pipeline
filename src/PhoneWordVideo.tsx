import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import phoneConfig from "../data/phone-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const PhoneWordVideo: React.FC = () => {
  return <WordVideoPlayer config={phoneConfig as WordConfig} />;
};

import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import allureConfig from "../data/allure-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AllureWordVideo: React.FC = () => {
  return <WordVideoPlayer config={allureConfig as WordConfig} />;
};

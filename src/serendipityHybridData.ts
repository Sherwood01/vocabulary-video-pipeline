export const SERENDIPITY_FPS = 30;

export const SERENDIPITY_AUDIO_PATHS = [
  "serendipity-audio-v3/scene1.mp3",
  "serendipity-audio-v3/scene2.mp3",
  "serendipity-audio-v3/scene3.mp3",
  "serendipity-audio-v3/scene4.mp3",
  "serendipity-audio-v3/scene5.mp3",
] as const;

export const SERENDIPITY_SCENE_FRAMES: [number, number, number, number, number] = [423, 550, 384, 826, 312];

export const SERENDIPITY_TOTAL_FRAMES = 2495;

export type Beat = { startFrame: number; endFrame: number; text: string };

export const SERENDIPITY_SCENE_BEATS: readonly Beat[][] = [[{'startFrame': 15, 'endFrame': 161, 'text': '你有没有过这种经历：明明没在找什么东西，它却突然出现在你面前，'}, {'startFrame': 161, 'endFrame': 235, 'text': '而且你一看就知道，这东西特别好。'}, {'startFrame': 235, 'endFrame': 300, 'text': '英语里，有一个专门的词来形容这种感觉，叫做 serendipity。'}, {'startFrame': 300, 'endFrame': 340, 'text': ''}, {'startFrame': 340, 'endFrame': 380, 'text': ''}], [{'startFrame': 15, 'endFrame': 132, 'text': 'serendipity 这个词，是从一个古老的地名 Serendip 变来的。'}, {'startFrame': 140, 'endFrame': 200, 'text': '那地方在今天的斯里兰卡附近。'}, {'startFrame': 215, 'endFrame': 371, 'text': '传说有三个王子去旅行，一路上他们总会在意外中发现有用的线索。'}, {'startFrame': 380, 'endFrame': 503, 'text': '后来，人们就把意外发现美好这件事，叫做 serendipity。'}], [{'startFrame': 10, 'endFrame': 91, 'text': 'serendipity 和我们常说的运气好可不一样。'}, {'startFrame': 100, 'endFrame': 164, 'text': 'lucky 只是碰上了好事；'}, {'startFrame': 175, 'endFrame': 258, 'text': '但 serendipity 还需要你有一双会观察的眼睛。'}, {'startFrame': 270, 'endFrame': 336, 'text': '光遇见不够，发现才是关键。'}], [{'startFrame': 15, 'endFrame': 118, 'text': '历史上最著名的 serendipity，就是青霉素的发明。'}, {'startFrame': 125, 'endFrame': 266, 'text': '一九二八年，科学家弗莱明忘了盖住一个培养皿，霉菌长了进去。'}, {'startFrame': 275, 'endFrame': 342, 'text': '这本该是一次失败的实验。'}, {'startFrame': 355, 'endFrame': 503, 'text': '但他没有扔掉它，而是认真观察，看出了这种霉菌能杀死细菌。'}, {'startFrame': 515, 'endFrame': 553, 'text': '青霉素，就这样被发现了。'}, {'startFrame': 570, 'endFrame': 776, 'text': '你看，这就是 serendipity 最好的例子：一次意外，加上一双认真的眼睛，最后改变了整个世界。'}], [{'startFrame': 15, 'endFrame': 69, 'text': '所以记住，serendipity 等于三件事：'}, {'startFrame': 80, 'endFrame': 120, 'text': '没在找、'}, {'startFrame': 120, 'endFrame': 160, 'text': '碰见了、'}, {'startFrame': 160, 'endFrame': 193, 'text': '还认得出它的特别。'}, {'startFrame': 210, 'endFrame': 263, 'text': '愿你在生活中，也能拥有这样一双眼睛。'}]];

let accOff = 0;
export const SERENDIPITY_SCENE_OFFSETS: number[] = [];
for (const d of SERENDIPITY_SCENE_FRAMES) {
  SERENDIPITY_SCENE_OFFSETS.push(accOff);
  accOff += d;
}

// Legacy Manim clip paths
export const MANIM_CLIPS = {
  origin: "manim-clips/serendipity-origin.mp4",
} as const;

export const HYBRID_FPS = SERENDIPITY_FPS;
export const HYBRID_SCENES = { hero: 90, split: 120, manim: 120, pipeline: 90 } as const;
export const HYBRID_TOTAL_FRAMES = Object.values(HYBRID_SCENES).reduce((sum, item) => sum + item, 0);

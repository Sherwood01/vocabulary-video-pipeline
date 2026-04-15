export const SILHOUETTE_FPS = 30;

export const SILHOUETTE_AUDIO_PATHS = [
  "silhouette-audio-v1/scene1.mp3",
  "silhouette-audio-v1/scene2.mp3",
  "silhouette-audio-v1/scene3.mp3",
  "silhouette-audio-v1/scene4.mp3",
  "silhouette-audio-v1/scene5.mp3",
] as const;

export const SILHOUETTE_SCENE_FRAMES: [number, number, number, number, number] = [333, 780, 390, 516, 285];

export const SILHOUETTE_TOTAL_FRAMES = 2304;

export type Beat = { startFrame: number; endFrame: number; text: string };

export const SILHOUETTE_SCENE_BEATS: readonly Beat[][] = [[{'startFrame': 15, 'endFrame': 120, 'text': '你有没有见过这样一种画：它全是黑色的，只能看到一个人的侧面轮廓，'}, {'startFrame': 60, 'endFrame': 120, 'text': ''}, {'startFrame': 120, 'endFrame': 165, 'text': '但你一眼就能认出他是谁。'}, {'startFrame': 255, 'endFrame': 273, 'text': '英语里，这种画叫做 silhouette。'}, {'startFrame': 273, 'endFrame': 300, 'text': ''}], [{'startFrame': 15, 'endFrame': 138, 'text': 'silhouette 这个词，其实来自一位法国财政部长的名字。他叫 Étienne de Silhouette。'}, {'startFrame': 150, 'endFrame': 270, 'text': '因为他推行紧缩政策，人们讽刺他吝啬。'}, {'startFrame': 285, 'endFrame': 495, 'text': '当时的画家们就用一种最便宜的方式画人像：剪一张黑色纸，贴出侧面轮廓，来嘲笑他小气。'}, {'startFrame': 510, 'endFrame': 714, 'text': '没想到，这种画后来大受欢迎，而 silhouette 这个词，也就一直流传到了今天。'}, {'startFrame': 540, 'endFrame': 714, 'text': ''}], [{'startFrame': 10, 'endFrame': 80, 'text': 'silhouette 和我们平常说的影子可不一样。'}, {'startFrame': 100, 'endFrame': 180, 'text': 'shadow 只是光被挡住后形成的黑影；'}, {'startFrame': 198, 'endFrame': 300, 'text': '但 silhouette 是艺术家刻意剪出来的轮廓，是一种简洁的美。'}, {'startFrame': 330, 'endFrame': 360, 'text': ''}], [{'startFrame': 15, 'endFrame': 71, 'text': '生活中处处都有 silhouette。'}, {'startFrame': 100, 'endFrame': 160, 'text': '日落时，窗户前站着一个人的黑色轮廓；'}, {'startFrame': 175, 'endFrame': 265, 'text': '山顶上，太阳把远山剪成一条黑线。'}, {'startFrame': 290, 'endFrame': 355, 'text': '你看不清细节，却觉得特别好看。'}, {'startFrame': 380, 'endFrame': 430, 'text': '这就是 silhouette 的魅力：少即是多。'}, {'startFrame': 450, 'endFrame': 480, 'text': ''}], [{'startFrame': 15, 'endFrame': 62, 'text': '所以记住，silhouette 就是三件事：'}, {'startFrame': 75, 'endFrame': 84, 'text': '黑色、'}, {'startFrame': 100, 'endFrame': 110, 'text': '侧面、'}, {'startFrame': 118, 'endFrame': 134, 'text': '只留轮廓。'}, {'startFrame': 150, 'endFrame': 225, 'text': '愿你在生活中，也能发现这种简洁的美。'}]];

let accOff = 0;
export const SILHOUETTE_SCENE_OFFSETS: number[] = [];
for (const d of SILHOUETTE_SCENE_FRAMES) {
  SILHOUETTE_SCENE_OFFSETS.push(accOff);
  accOff += d;
}

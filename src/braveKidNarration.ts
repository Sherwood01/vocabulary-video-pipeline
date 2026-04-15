export const BRAVE_KID_AUDIO = [
  {
    id: "scene1",
    text: "今天我们学一个英文词，Brave。它的意思是，勇敢。可是勇敢，不是一点都不害怕。",
    audio: "brave-kid-audio/scene1.mp3",
    duration: 7.152,
    total_duration: 7.852,
    start_sec: 0,
  },
  {
    id: "scene2",
    text: "Brave 更像是，心里有一点怕，可是脚还是愿意往前走。比如你有点紧张，还是愿意举手试一试。",
    audio: "brave-kid-audio/scene2.mp3",
    duration: 8.664,
    total_duration: 9.363999999999999,
    start_sec: 7.852,
  },
  {
    id: "scene3",
    text: "勇敢也可以是，做错了以后敢说对不起。看到别人需要帮助的时候，愿意站出来帮一把。",
    audio: "brave-kid-audio/scene3.mp3",
    duration: 6.624,
    total_duration: 7.324,
    start_sec: 17.216,
  },
  {
    id: "scene4",
    text: "所以你可以这样记。 有一点怕，加上往前一步，再加上做对的事，就很接近 Brave。",
    audio: "brave-kid-audio/scene4.mp3",
    duration: 6.0,
    total_duration: 6.7,
    start_sec: 24.54,
  },
  {
    id: "scene5",
    text: "最后记住一句话。 Brave does not mean no fear. 勇敢不是一点都不怕，而是害怕的时候，也愿意做对的事。",
    audio: "brave-kid-audio/scene5.mp3",
    duration: 9.288,
    total_duration: 9.988,
    start_sec: 31.24,
  },
] as const;

export const BRAVE_KID_FPS = 30;
export const BRAVE_KID_SCENE_FRAMES = BRAVE_KID_AUDIO.map((item) => Math.round(item.total_duration * BRAVE_KID_FPS));
export const BRAVE_KID_TOTAL_FRAMES = BRAVE_KID_SCENE_FRAMES.reduce((sum, item) => sum + item, 0);

export const BRAVE_KID_SCENE_BEATS = [
  [
    {text: "今天我们学一个英文词，Brave。", startFrame: 0, endFrame: 94, startMs: 0, endMs: 3125},
    {text: "它的意思是，勇敢。", startFrame: 94, endFrame: 143, startMs: 3125, endMs: 4779},
    {text: "可是勇敢，不是一点都不害怕。", startFrame: 143, endFrame: 221, startMs: 4779, endMs: 7352},
  ],
  [
    {text: "Brave 更像是，", startFrame: 0, endFrame: 53, startMs: 7852, endMs: 9625},
    {text: "心里有一点怕，", startFrame: 53, endFrame: 95, startMs: 9625, endMs: 11003},
    {text: "可是脚还是愿意往前走。", startFrame: 95, endFrame: 160, startMs: 11003, endMs: 13170},
    {text: "比如你有点紧张，", startFrame: 160, endFrame: 207, startMs: 13170, endMs: 14745},
    {text: "还是愿意举手试一试。", startFrame: 207, endFrame: 266, startMs: 14745, endMs: 16715},
  ],
  [
    {text: "勇敢也可以是，", startFrame: 0, endFrame: 37, startMs: 17216, endMs: 18441},
    {text: "做错了以后敢说对不起。", startFrame: 37, endFrame: 94, startMs: 18441, endMs: 20366},
    {text: "看到别人需要帮助的时候，", startFrame: 94, endFrame: 157, startMs: 20366, endMs: 22465},
    {text: "愿意站出来帮一把。", startFrame: 157, endFrame: 205, startMs: 22465, endMs: 24040},
  ],
  [
    {text: "所以你可以这样记。", startFrame: 0, endFrame: 43, startMs: 24540, endMs: 25971},
    {text: "有一点怕，", startFrame: 43, endFrame: 67, startMs: 25971, endMs: 26766},
    {text: "加上往前一步，", startFrame: 67, endFrame: 100, startMs: 26766, endMs: 27878},
    {text: "再加上做对的事，", startFrame: 100, endFrame: 138, startMs: 27878, endMs: 29150},
    {text: "就很接近 Brave。", startFrame: 138, endFrame: 186, startMs: 29150, endMs: 30740},
  ],
  [
    {text: "最后记住一句话。", startFrame: 0, endFrame: 40, startMs: 31240, endMs: 32572},
    {text: "Brave does not mean no fear.", startFrame: 40, endFrame: 155, startMs: 32572, endMs: 36400},
    {text: "勇敢不是一点都不怕，", startFrame: 155, endFrame: 205, startMs: 36400, endMs: 38065},
    {text: "而是害怕的时候，", startFrame: 205, endFrame: 245, startMs: 38065, endMs: 39396},
    {text: "也愿意做对的事。", startFrame: 245, endFrame: 285, startMs: 39396, endMs: 40728},
  ],
] as const;

export const BRAVE_KID_CAPTIONS = BRAVE_KID_SCENE_BEATS.flatMap((scene) =>
  scene.map((beat) => ({
    text: beat.text,
    startMs: beat.startMs,
    endMs: beat.endMs,
    timestampMs: beat.startMs,
    confidence: 1,
  })),
) as Array<{
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
  confidence: number;
}>;

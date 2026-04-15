import { WordConfig } from "../pipeline/types";

export const NOSTALGIA_CONFIG: WordConfig = {
  word: "nostalgia",
  title: "乡愁与怀旧",
  fps: 30,
  audioPrefix: "nostalgia-audio-v1",
  scenes: [
    {
      type: "hero-word",
      beats: [
        { startFrame: 15, endFrame: 165, text: "你有没有过这种感觉：闻到某种味道、听到某首歌，突然想起很久以前的事。" },
        { startFrame: 67, endFrame: 102, text: "" },  // tag: 味道
        { startFrame: 102, endFrame: 132, text: "" },  // tag: 听到
        { startFrame: 165, endFrame: 195, text: "" },  // tag: 想起
        { startFrame: 204, endFrame: 264, text: "心里既温暖，又有一点点酸酸的。" },
        { startFrame: 330, endFrame: 390, text: "英语里，这种感觉叫做 nostalgia。" },
      ],
      props: {
        word: "nostalgia",
        subtitle: "想回家的痛",
        tags: ["闻到味道", "听到老歌", "想起往事"],
      },
    },
    {
      type: "origin-chain",
      beats: [
        { startFrame: 15, endFrame: 57, text: "nostalgia 来自两个希腊词。" },
        { startFrame: 76, endFrame: 132, text: "nostos，意思是回家；" },
        { startFrame: 154, endFrame: 204, text: "algos，意思是痛苦。" },
        { startFrame: 231, endFrame: 294, text: "合在一起，就是想回家的痛。" },
        { startFrame: 321, endFrame: 450, text: "后来，人们用它来形容对过去美好时光的怀念。" },
      ],
      props: {
        title: "从希腊语走来",
        kicker: "它的来历",
        nodes: [
          { label: "nostos", note: "回家", color: "#60a5fa" },
          { label: "algos", note: "痛苦", color: "#fb7185" },
          { label: "nostalgia", note: "想回家的痛", color: "#34d399" },
          { label: "怀念", note: "对美好时光的追忆", color: "#f472b6" },
        ],
        arrowLabel: "希腊词根 → 合成词 → 引申义",
      },
    },
    {
      type: "meaning-compare",
      beats: [
        { startFrame: 10, endFrame: 50, text: "nostalgia 和 memory 不一样。" },
        { startFrame: 50, endFrame: 102, text: "memory 只是记住一件事；" },
        { startFrame: 116, endFrame: 270, text: "但 nostalgia 是带着感情的怀念，有温暖，也有淡淡的忧伤。" },
      ],
      props: {
        title: "它和 memory 有什么不同",
        kicker: "意义辨析",
        leftLabel: "memory",
        leftNote: "只是记住",
        rightLabel: "nostalgia",
        rightNote: "带着感情怀念",
        bottomText: "想念，是因为曾经美好",
      },
    },
    {
      type: "full-screen-mood",
      beats: [
        { startFrame: 15, endFrame: 69, text: "生活中，nostalgia 无处不在。" },
        { startFrame: 87, endFrame: 133, text: "外婆做的饭菜香，" },
        { startFrame: 136, endFrame: 165, text: "老照片里的笑容，" },
        { startFrame: 189, endFrame: 315, text: "或者夏天傍晚，蝉鸣和西瓜的味道。" },
      ],
      props: {
        title: "处处都有 nostalgia",
        kicker: "生活中的怀旧",
        moodLines: [
          "生活中，nostalgia 无处不在。",
          "外婆做的饭菜香，老照片里的笑容，",
          "或者夏天傍晚，蝉鸣和西瓜的味道。",
        ],
        centerEmoji: "🍉",
        bottomQuote: "过去的美好，从未真正离开",
      },
    },
    {
      type: "ending-summary",
      beats: [
        { startFrame: 15, endFrame: 63, text: "所以记住，nostalgia 的三件事：" },
        { startFrame: 75, endFrame: 93, text: "想回家、" },
        { startFrame: 108, endFrame: 122, text: "忆美好、" },
        { startFrame: 135, endFrame: 155, text: "心里暖暖的，也酸酸的。" },
        { startFrame: 202, endFrame: 300, text: "愿你在怀旧中，也能找到前行的力量。" },
      ],
      props: {
        title: "nostalgia 的三件事",
        kicker: "记住它",
        formula: "nostalgia = ?",
        points: [
          { text: "想回家", color: "#60a5fa" },
          { text: "忆美好", color: "#34d399" },
          { text: "暖暖的酸", color: "#f472b6" },
        ],
        closing: "愿你在怀旧中，也能找到前行的力量",
      },
    },
  ],
};

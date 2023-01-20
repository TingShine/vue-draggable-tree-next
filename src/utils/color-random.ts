const levelPoint = [50, 100, 200];

const colors = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "cyan",
  "sky",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

const unUsedColor = new Map<number, Set<string>>();
levelPoint.forEach((point) => unUsedColor.set(point, new Set(colors)));

const generateRandomNum = (num: number): number =>
  parseInt(Math.random() * (num + 1), 10);

export const useColor = (prefix: string) => {
  /**
   * 获取随机背景颜色
   * @param {number} level 嵌套层级 [0-n]
   * @returns {string} hover的时候背景颜色class
   */
  const getRandomColor = (level: number): string => {
    const index: number =
      level < levelPoint.length ? level : levelPoint.length - 1;
    const colorSet: Set<string> = unUsedColor.get(levelPoint[index])!;
    let colorArr: string[];

    // 颜色都取完一遍
    if (!colorSet.size) {
      unUsedColor.set(levelPoint[index], new Set(colors));
      colorArr = colors;
    } else {
      colorArr = [...colorSet.values()];
    }

    const color = colorArr[generateRandomNum(colorArr.length - 1)];
    colorSet.delete(color);
    return `${prefix ? `${prefix}-` : ""}${color}-${levelPoint[level]}`;
  };

  return {
    getRandomColor,
  };
};

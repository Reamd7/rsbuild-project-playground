// 统一的元素数量配置
export const ELEMENT_COUNT = 3000;

// 生成元素列表的工具函数
export const createElementList = (count: number = ELEMENT_COUNT) => {
  return Array.from({ length: count })
    .fill(0)
    .map((item, index) => index);
};
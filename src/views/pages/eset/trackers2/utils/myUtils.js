function formatNumber(num,n) {
  /**
   * 格式化数字，如果是小数，保留n位小数，如果是整数不处理
   */
  // 判断数字是否为整数
  if (Number.isInteger(num)) {
    return num; // 如果是整数，直接返回该数字
  } else {
    // 如果是小数，则保留两位小数
    return +(num.toFixed(n));
  }
}



export { formatNumber}

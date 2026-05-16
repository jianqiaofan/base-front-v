export default {
  /**
   * 传入Date对象,转为时间字符串(不考虑系统时区)
   * @type {string}
   */
  getDateToString(date = new Date()) {
    const year = ('' + date.getFullYear()).padStart(4, '0')
    const month = ('' + (date.getMonth() + 1)).padStart(2, '0')
    const ddate = ('' + (date.getDate())).padStart(2, '0')
    const hours = ('' + date.getHours()).padStart(2, '0')
    const minutes = ('' + date.getMinutes()).padStart(2, '0')
    const seconds = ('' + date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${ddate} ${hours}:${minutes}:${seconds}`
  },

  /**
   * 传入0时区的Date对象,转为时间字符串(考虑系统时区)
   * @type {string}
   */
  getDateToLocalString(date = new Date()) {

    const year = ('' + date.getFullYear()).padStart(4, '0')
    const month = ('' + (date.getMonth() + 1)).padStart(2, '0')
    const ddate = ('' + (date.getDate())).padStart(2, '0')
    const hours = ('' + date.getHours()).padStart(2, '0')
    const minutes = ('' + date.getMinutes()).padStart(2, '0')
    const seconds = ('' + date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${ddate} ${hours}:${minutes}:${seconds}`
  },

  /**
   * 格式化数字，如果是小数，保留n位小数，如果是整数不处理
   */
  formatNumber(num, n) {
    // 判断数字是否为整数
    const regexp = new RegExp("\d+(.\d+){0,1}")
    if( regexp.test(num)){
      if (Number.isInteger(num)) {
        return num // 如果是整数，直接返回该数字
      } else {
        // 如果是小数，则保留n位小数
        return +(num.toFixed(n))
      }
    } else {
      return num
    }
  }
}

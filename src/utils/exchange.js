// 这是从互联网上获取汇率数据的函数
async function getExchangeRates() {
  try {
    const response = await fetch('https://v2.xxapi.cn/api/allrates', {
      method: 'GET',
      headers: {
        Authorization: 'c13f5bd01592deb3'
      }
    })

    const data = await response.json()
    
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default getExchangeRates



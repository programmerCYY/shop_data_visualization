const shopPartNameMap = {
  文具服饰:'cloth'
}

export function getShopMapInfo (arg) {
  const path = `hotmap${shopPartNameMap[arg]}json`
  return {
    key: shopPartNameMap[arg],
    path: path
  }
}

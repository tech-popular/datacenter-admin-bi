
export function getCookie(key: string): string {
  const arrCookie = decodeURIComponent(document.cookie).split(';')
  let str = ''
  arrCookie.forEach((item) => {
    const itemArr = item.trim().split('=')
    if (key === itemArr[0]) {
      str = itemArr[1]
    }
  })
  return str
}

/**
 * 删除单个cookie
 */
 export function removeCookie(key: string): void {
  const exp = new Date()
  exp.setTime(exp.getTime() - 1)
  const cval = getCookie(key)
  if (cval !== null) {
    document.cookie =
      key + '=; expires=' + exp.toUTCString() + ';path=/;' + `domain=${document.domain.split('.').slice(-2).join('.')}`
  }
}

export function setCookie(key: string, value: string): void {
  document.cookie = `${key}=${encodeURI(value)};Path=${encodeURI('/')};domain=.${document.domain
    .split('.')
    .slice(-2)
    .join('.')}`
}

/**
 * 获取Url参数中指定name的值
 * @param name 参数名称
 * @returns {string}
 */
 export function getUrlParam(name: string): string {
  const re = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let value = ''
  const arrHash = window.location.hash.split('?')
  const arrSearch = window.location.search.substr(1).split('?')

  arrHash.shift()
  const arr = arrSearch.concat(arrHash)

  for (let i = 0; i < arr.length; i++) {
    const r = arr[i].match(re)
    if (r !== null && r[2]) {
      value = r[2]
      break
    }
  }
  return value
}

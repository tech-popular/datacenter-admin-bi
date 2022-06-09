import * as dd from 'dingtalk-jsapi'
const NODE_ENV = process.env.NODE_ENV
console.log('NODE_ENV: ', NODE_ENV)
let baseURL
if (NODE_ENV == 'development') {
  baseURL = 'http://192.168.161.219:8000/canary-admin;'
} else if (NODE_ENV == 'production') {
  if (dd.env.platform !== 'notInDingTalk') {
    baseURL = 'http://tech.9f.cn/canary-admin'
  } else {
    baseURL = 'http://tech.9f.cn/canary-admin'
  }
} else if (NODE_ENV == 'test') {
  baseURL = 'http://192.168.161.219:8000/canary-admin;'
}
const base = {
  baseurl: baseURL,
}
export default base

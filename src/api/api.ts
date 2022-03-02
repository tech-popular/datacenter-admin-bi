import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { showMessage } from './status'
import { ElMessage, ElLoading } from 'element-plus'
import { IResponse, ILogin, ZLogin, IModelColumn, IModelSearch } from './type'
import * as dd from 'dingtalk-jsapi'
import { useRoute } from 'vue-router'
const route = useRoute()
let axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://192.168.161.219:8000/canary-admin', //test
  // baseURL: 'http://tech.9f.cn/canary-admin', //

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  },
})
let loadingInstance
// axios实例拦截请求
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    loadingInstance = ElLoading.service({ fullscreen: true })
    ;(config.headers as any).token = route.query.token
      ? route.query.token
      : localStorage.getItem('token')
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)
// axios实例拦截响应
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    loadingInstance.close()
    if (response.status === 200) {
      if (dd.env.platform === 'notInDingTalk') {
        if (response.data && response.data.code === 401) {
          // 401, token失效
          if (process.env.NODE_ENV != 'production') {
            console.log('notInDingTalk: ')
            window.location.href = 'http://test.tech.9fbank.com/canary/#/login' //test
          } else {
            window.location.href = 'http://tech.9fbank.com/canary/#/login'
          }
        }
      }
      return response
    } else {
      showMessage(response.status)
      return response
    }
  },
  // 请求失败
  (error: any) => {
    loadingInstance.close()
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status)
      return Promise.reject(response.data)
    } else {
      ElMessage.warning('网络连接异常,请稍后再试!')
    }
  }
)

/**
 * @description: 用户登录
 * @params {ILogin} params
 * @return {Promise}
 */

export const PcLogin = (params: ILogin): Promise<IResponse> => {
  return axiosInstance
    .get('/bi/biSysMenu/getUserMenuList', { params })
    .then((res) => res.data)
}
export const DdLogin = (params: ILogin): Promise<IResponse> => {
  return axiosInstance
    .get('/bi/dingding/biSysMenu/getUserMenuList', { params })
    .then((res) => res.data)
}

export const SysLogin = (params: ZLogin): Promise<IResponse> => {
  return axiosInstance.post('/sys/login', { ...params }).then((res) => res)
}

// 报表-查询列名接口
export const getReportColumns = (params: IModelColumn): Promise<IResponse> => {
  return axiosInstance
    .get('/bi/olapModelColumn/getColumnList', { params })
    .then((res) => res.data)
}

// 报表-查询搜索接口
export const getReportSearchData = (
  params: IModelSearch
): Promise<IResponse> => {
  return axiosInstance
    .post('/bi/olapModel/doSearchAnalysisModel', { ...params })
    .then((res) => res.data)
}

// tableau查询菜单接口
export const getTableauInfo = (modelId: string): Promise<IResponse> => {
  return axiosInstance
    .get(`/bi/tableau/info/${modelId}`)
    .then((res) => res.data)
}

// 新的-查询老BI报表的列名
export const getAnalysisModelColumn = (modelId: string): Promise<IResponse> => {
  return axiosInstance
    .get(`/bi/olapModel/getAnalysisModelColumn/${modelId}`)
    .then((res) => res.data)
}

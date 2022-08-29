import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { showMessage } from './status'
import { ElMessage, ElLoading } from 'element-plus'
import { IResponse, ILogin, ZLogin, IModelColumn, IModelSearch, VisitLog } from './type'
import * as dd from 'dingtalk-jsapi'
// import base from './untils'
let originHost = location.origin
let axiosInstance: AxiosInstance = axios.create({
  // baseURL: base.baseurl,
  baseURL: originHost + '/canary-admin',
  // baseURL: 'http://tech.9f.cn/canary-admin',
  // baseURL: 'http://192.168.208.14:8000/canary-admin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
    // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  },
})

// let loadingInstance
// axios实例拦截请求
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // loadingInstance = ElLoading.service({ fullscreen: false })
    ; (config.headers as any).token = localStorage.getItem('token')
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)
// axios实例拦截响应
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // loadingInstance.close()
    if (dd.env.platform !== 'notInDingTalk') {
      showMessage(response.status)
      return response
    } else {
      console.log('response: ', response);
      if (response.data && response.data.code === 401) {
        // 401, token失效
        ElMessage.error({ message: '尚未登录，请登录' })
        localStorage.removeItem('token')
        window.location.href = originHost + '/bi/#/login'
        return response
      } else {
        showMessage(response.status)
        return response
      }
    }
  },
  // 请求失败
  (error: any) => {
    // loadingInstance.close()
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
    .get('bi/biSysMenu/getUserLoginMenuList', { params })
    .then((res) => res.data)
}
export const DdLogin = (params: ILogin): Promise<IResponse> => {
  return axiosInstance
    .get('/bi/dingding/biSysMenu/getUserMenuList', { params })
    .then((res) => res.data)
}

export const SysLogin = (params: ZLogin): Promise<IResponse> => {
  return axiosInstance.post('/bi/sys/login', { ...params }).then((res) => res)
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
// export const getTableauInfo = (tableauId: string): Promise<IResponse> => {
//   return axiosInstance
//     .get(`/bi/tableau/info/${tableauId}`)
//     // .get('bi/tableau/tableauPage')
//     .then((res) => res.data)
// }
export const getTableauPage = (params: any): Promise<IResponse> => {
  return axiosInstance
    .get('/bi/tableau/tableauPage', { params })
    .then((res) => res.data)
}
// 新的-查询老BI报表的列名
export const getAnalysisModelColumn = (modelId: string): Promise<IResponse> => {
  return axiosInstance
    .get(`/bi/olapModel/getAnalysisModelColumn/${modelId}`)
    .then((res) => res.data)
}
// 访问日志
export const userVisitLog = (params: VisitLog): Promise<IResponse> => {
  return axiosInstance.post('/bi/userVisitLog/saveUserVisitLog', { ...params }).then((res) => res)
}
// 初始化报表数据
export const initDimForeignTableRedis = (): Promise<IResponse> => {
  return axiosInstance
    .get('/bi/initDimForeignTableRedis')
    .then((res) => res.data)
}
// 获取下拉框数据
export const getOptionSelect = (colRefTab: string): Promise<IResponse> => {
  return axiosInstance
    .get(`bi/olapModel/initBdRptDropDown/${colRefTab}`)
    .then((res) => res.data)
}
// 退出
export const logout = (): Promise<IResponse> => {
  return axiosInstance
    .post('bi/sys/logout')
    .then((res) => res)
}

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import { showMessage } from "./status";
import { ElMessage } from 'element-plus'
import { IResponse, ILogin } from './type';

let axiosInstance:AxiosInstance = axios.create({
  baseURL: "http://192.168.216.1:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data;charset=UTF-8"
  }
});

// axios实例拦截响应
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response;
    } else {
      showMessage(response.status);
      return response;
    }
  },
  // 请求失败
  (error: any) => {
    const {response} = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status);
      return Promise.reject(response.data);
    } else {
      ElMessage.warning('网络连接异常,请稍后再试!');
    }
  }
);

// axios实例拦截请求
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error:any) => {
    return Promise.reject(error);
  }
) 

/**
 * @description: 用户登录
 * @params {ILogin} params
 * @return {Promise}
 */
export const login = (params: ILogin): Promise<IResponse> => {
  return axiosInstance.get('/canary-admin/bi/biSysMenu/getUserMenuList',{ params: params }).then(res => res.data);
};


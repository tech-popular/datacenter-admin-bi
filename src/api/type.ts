// 返回res.data的interface
export interface IResponse {
    code?: number | string;
    data?: any;
    msg?: string;
    expire?:any;
    token?:any;
  }
  
  /**用户登录 */
  export interface ILogin {
    code?: string;
    userId?: string;
  }

  /**中台登录 */
  export interface ZLogin{
    username?:any;
    password?:any;
    t?:any
    uuid:any
  }
// 返回res.data的interface
export interface IResponse {
    code: number | string;
    data: any;
    msg: string;
  }
  
  /**用户登录 */
  export interface ILogin {
    code: string;
    userId: string;
  }
  
  
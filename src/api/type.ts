// 返回res.data的interface
export interface IResponse {
  code?: number | string
  data?: any
  msg?: string
  expire?: any
  token?: any
  dimList?: any
  optionList?: any
  orderList?: any
  theadList?: any
  url?: string
}

/**用户登录 */
export interface ILogin {
  code?: string
  userId?: string
}

/**中台登录 */
export interface ZLogin {
  username?: any
  password?: any
  t?: any
  uuid: any
}

/**报表列名 */
export interface IModelColumn {
  model_id: string
}

/**报表查询请求参数 */
export interface IModelSearch {
  model_id: string
  page: number
  pageSize: number
  ascColumn?: string // 升序字段，多个用逗号分隔
  descColumn?: string // 降序字段，多个用逗号分隔
  pt?: string // 时间范围，用逗号分隔
  groupColumn?: string // 分组字段，多个用逗号分隔
  dataList?: Array<object>
  dimList?: Array<string>
}
/**访问日志埋点参数 */
export interface VisitLog {
  menuName: string
  visitTimeStart?: any
  visitTimeEnd?: any
  menuId?: number // 
  visitTime?: string // 停留时间
  visitType?: number // 访问类型
}

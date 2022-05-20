<template>
  <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
    <el-form-item label="统计日期：" prop="dateParam" v-if="dateParamVisible">
      <el-date-picker v-model="searchForm.dateParam" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYYMMDD"></el-date-picker>
    </el-form-item>
    <!-- <el-form-item label="日期：" prop="dateOption" v-if="dateOptionVisible">
      <el-date-picker v-model="searchForm.dateOption" type="date" placeholder="选择日期" value-format="YYYYMMDD"></el-date-picker>
    </el-form-item>-->
    <!-- <el-form-item>
      <el-popover placement="right" width="400px" trigger="click">
        <template #reference>
          <el-button type="info" plain>过滤条件</el-button>
        </template>
        <el-row justify="left">
          <el-col :span="12">
            <span>请选择过滤条件</span>
          </el-col>
        </el-row>
        <div v-for="item in optionParams" :key="item.colRefTab">
          <el-form-item :label="item.colBizName">
            <el-input v-model="item.colFlag" @input="handleInputString" placeholder="请输入过滤条件"></el-input>
          </el-form-item>
          <el-form-item :label="item.colBizName">
            <InputTag v-model="item.colFlag" :valueType="'string'" :add-tag-on-blur="true" :allow-duplicates="true" class="itemIput inputTag" placeholder="可用回车输入多条" />
          </el-form-item>
          <el-form-item :label="item.colBizName">
            <el-select>
              <el-option label="测试1" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="item.colBizName">
            <el-date-picker v-model="value2" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYYMMDD"></el-date-picker>
          </el-form-item>
          <el-form-item :label="item.colBizName">
            <el-date-picker v-model="value2" type="date" placeholder="选择日期" value-format="YYYYMMDD"></el-date-picker>
          </el-form-item>
        </div>
      </el-popover>
    </el-form-item>-->
    <el-form-item v-model="dimParams.length">
      <el-popover placement="right" width="400px" trigger="click">
        <template #reference>
          <el-button type="info" plain>维度</el-button>
        </template>
        <el-row justify="left">
          <el-col :span="12">
            <span>请选择维度</span>
          </el-col>
          <el-col :span="12">
            <el-checkbox v-model="checkDimAll" :indeterminate="isDimIndeterminate" @change="handleCheckAllChangeDim">全选</el-checkbox>
          </el-col>
        </el-row>
        <el-checkbox-group v-model="checkedDim" @change="handleCheckedDimChange">
          <div v-for="item in dimParams" :key="item.tabID">
            <el-checkbox :label="item.colName">{{ item.colBizName }}</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-popover>
    </el-form-item>
    <el-form-item>
      <el-popover placement="right" width="400px" trigger="click">
        <template #reference>
          <el-button type="info" plain>指标</el-button>
        </template>
        <el-row justify="left">
          <el-col :span="12">
            <span>请选择指标</span>
          </el-col>
          <el-col :span="12">
            <el-checkbox v-model="checkFieldAll" :indeterminate="isFieldIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          </el-col>
        </el-row>

        <el-checkbox-group v-model="checkedFields" @change="handleCheckedFieldChange">
          <div v-for="field in indexParams" :key="field.name">
            <el-checkbox :label="field.colName">{{field.colBizName}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-popover>
    </el-form-item>
    <el-form-item>
      <el-popover placement="right" width="500px" trigger="click">
        <template #reference>
          <el-button type="info" plain>排序</el-button>
        </template>
        <el-row justify="left">
          <el-col :span="6">
            <span>请选择排序</span>
          </el-col>
          <el-col :span="18">
            <span style="color:red">请拖动进行排序，并选择升/降序（灰色箭头为不排序）</span>
          </el-col>
        </el-row>
        <el-checkbox-group v-model="checkedorders">
          <div v-for="(order, index) in orderParams" :key="index" draggable="true" @dragstart="dragstart(order)" @dragenter="dragenter(order)" @dragend="dragend(order)">
            <el-checkbox :label="order.colName">{{order.colBizName}}</el-checkbox>
            <img v-if="checkedorders.includes(order.colName)" @click="changeOrderFlag(order, index)" :src="order.colOrderFlag ? (order.colOrderFlag === 1 ? order1 : order2) : order0" />
          </div>
        </el-checkbox-group>
      </el-popover>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="onSearch">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" fit border stripe :header-cell-class-name="handleHeadAddClass" @sort-change="onSortChange" size="small">
    <template v-for="column in columnDatas" :key="column.tabID">
      <el-table-column :prop="column.colName" :label="column.colBizName" :sortable="column.sortable" />
    </template>
  </el-table>
  <div class="pagination">
    <el-pagination
      v-model:currentPage="pagination.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  nextTick,
  defineAsyncComponent,
  toRaw
} from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import {
  // getReportColumns,
  getReportSearchData,
  getAnalysisModelColumn
} from '@/api/api'
import { IResponse, IModelSearch } from '@/api/type'
import order0 from '@/static/image/order0.gif'
import order1 from '@/static/image/order1.gif'
import order2 from '@/static/image/order2.gif'
const InputTag = defineAsyncComponent(() => import('./components/InputTag.vue'))
import dayjs from 'dayjs'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
export default defineComponent({
  name: 'TableData',
  components: { InputTag },
  data() {
    return {
      pagination: {
        page: 1,
        pageSize: 10,
        total: 200
      },
      searchForm: {
        dateParam: [],
        dateOption: [],
        dim: [],
        option: []
      }, // 查询条件报表数据
      dateParamVisible: true,
      dateOptionVisible: true,
      value2: '',
      columnDatas: [], // 记录表头数据
      optionParams: [], // 记录过 滤条件数据
      dimParams: [], // 记录维度数据
      indexParams: [], // 记录指标数据
      orderParams: [], // 记录排序指标
      checkedorders: [], // 排序勾选值
      checkedDim: [], // 选中的维度
      conditionList: [], // 日期条件list
      sortField: {}, // 记录排序的字段
      // 指标
      checkedFields: [], // 选中的指标
      checkFieldAll: false, // 全选状态
      isFieldIndeterminate: false, // 全选状态
      // 维度
      checkDimAll: false, // 全选状态
      isDimIndeterminate: false, // 全选状态
      tabNum: 1
    }
  },
  setup() {
    const route: RouteLocationNormalized = useRoute()
    const modelId: string = String(route.params.modelId)
    const clickVal = ref<string>()
    const moveVal = ref<string>()
    const endVal = ref<string>()
    // const columnDatas: any = ref([]) // 记录表头数据
    // const dateParam: any = ref([]) // 记录日期字段
    // // const dateOption = ref('') // 年月时间格式
    // const optionParams: any = ref([]) // 记录过 滤条件数据
    // const dimParams: any = ref([]) // 记录维度数据
    // const indexParams: any = ref([]) // 记录指标数据
    // const orderParams: any = ref([]) // 记录排序指标
    // const checkedorders: any = ref([]) // 排序勾选值
    // const checkedDim: any = ref([]) // 选中的维度
    // const conditionList: any = ref([]) // 日期条件list
    // const getColumns = async () => {
    //   const res: IResponse = await getAnalysisModelColumn(modelId)
    //   console.log('res:报表 ', res)
    //   console.log('res:DimHTMLList  ', res.dimHTMLList)
    //   // console.log('res:KpiHTMLList  ', res.kpiHTMLList)
    //   // console.log('res:OrderHTMLList  ', res.orderHTMLList)
    //   // console.log('res:headRows  ', res.headRows)
    //   console.log('res.optionHTMLList: ', res.optionHTMLList)
    //   columnDatas.value = res.headRows
    //   optionParams.value = res.optionHTMLList
    //   orderParams.value = res.orderHTMLList

    //   //  排序
    //   orderParams.value.forEach(element => {
    //     if (element.colOrderFlag) {
    //       checkedorders.value.push(element.colName)
    //     }
    //   })
    //   // conditionList.value = res.conditionList
    //   // searchForm.dateParam = res.DateTextConditionHTML.split(
    //   //   '统计日期:'
    //   // )[1].split(':')
    //   // console.log('searchForm.dateParam: ', searchForm.dateParam)
    //   // columnDatas.value.map(item => {
    //   //   item.sortable = 'custom'
    //   // })

    //   // let dateItem = res.theadList.filter(item => {
    //   //   return item.dataType === 'date'
    //   // })
    //   // console.log('res.dateOptionConditioHTML: ', res.dateOptionConditioHTML)
    //   dimParams.value = res.dimHTMLList
    //   // 维度
    //   dimParams.value.forEach(element => {
    //     if (element.dimDisabled == 2) {
    //       checkedDim.value.push(element.colName)
    //     }
    //   })
    //   indexParams.value = res.kpiHTMLList
    // }
    const tableData: any = ref([])
    const getTableData = async (params: IModelSearch) => {
      const res: IResponse = await getReportSearchData(params)
      tableData.value = res.data
    }

    return {
      modelId,
      // columnDatas,
      tableData,
      // getColumns,
      getTableData,
      // dimParams,
      // optionParams,
      // indexParams,
      // orderParams,
      // checkedorders,
      order0,
      order1,
      order2,
      dayjs,
      clickVal,
      moveVal,
      endVal
      // dateParam
      // checkedDim,
      // ...toRefs(searchForm),
      // handleFilterCondition,
      // conditionList
    }
  },
  mounted() {
    // 获取表头数据
    this.getColumns()
  },
  methods: {
    // 搜索数据
    searchData() {
      let params: IModelSearch = {
        modelID: Number(this.modelId),
        pageNo: this.pagination.page,
        pageRows: this.pagination.pageSize
        // dimCodeJSON: {}, // 维度入参
        // kpiCodeJSON: {}, // 指标入参
        // dateTextJSON: {}, // 统计日期
        // dateOptionJSON: {},
        // optionJSON: {},
        // textJSON: {},
        // orderJSON: {}, // 排序入参
        // compareTextJson: {}
      }
      // 统计日期
      // if (this.searchForm.dateParam.length) {
      //   params.dateTextJSON = {
      //     beginTimeKey: JSON.stringify(this.conditionList[0]),
      //     beginTimeValue: this.searchForm.dateParam[0],
      //     endTimeKey: JSON.stringify(this.conditionList[0]),
      //     endTimeValue: this.searchForm.dateParam[1]
      //   }
      // }
      // // 排序
      // if (this.checkedorders.length) {
      //   let orderDataJSON = []
      //   this.orderParams.filter(item => {
      //     if (this.checkedorders.indexOf(item.colName) > -1) {
      //       orderDataJSON.push({
      //         column: JSON.stringify(item),
      //         value: JSON.stringify(item.colOrderFlag)
      //         // column: item,
      //         // value: item.colOrderFlag
      //       })
      //     }
      //   })
      //   params.orderJSON = orderDataJSON
      // }
      // // 指标
      // if (this.checkedFields.length) {
      //   let kpiCodeDataJSON = []
      //   this.indexParams.filter(item => {
      //     if (this.checkedFields.indexOf(item.colName) > -1) {
      //       kpiCodeDataJSON.push(JSON.stringify(item))
      //     }
      //   })
      //   params.kpiCodeJSON = kpiCodeDataJSON
      // }
      // // 维度
      // if (this.checkedDim.length) {
      //   let dimCodeDataJSON = []
      //   this.dimParams.filter(item => {
      //     if (this.checkedDim.indexOf(item.colName) > -1) {
      //       dimCodeDataJSON.push(JSON.stringify(item))
      //     }
      //   })
      //   params.dimCodeJSON = dimCodeDataJSON
      // }
      // const formData = new FormData()
      // Object.keys(params).forEach(key => {
      //   formData.append(key, params[key])
      // })
      // axios({
      //   method: 'post',
      //   url: `https://tech.9f.cn/canary-admin/bi/olapModel/doSearchAnalysisModel`,
      //   data: formData,
      //   headers: {
      //     token: localStorage.getItem('token')
      //   }
      // }).then(res => {
      //   console.log('res: ', res)
      // })
      this.getTableData(params)
    },
    async getColumns() {
      const res: IResponse = await getAnalysisModelColumn(this.modelId)
      console.log('res:报表 ', res)
      console.log('res.optionHTMLList: ', res.optionHTMLList)
      this.columnDatas = res.headRows
      this.optionParams = res.optionHTMLList
      this.orderParams = res.orderHTMLList
      //  排序
      this.orderParams.forEach(element => {
        if (element.colOrderFlag) {
          this.checkedorders.push(element.colName)
        }
      })
      this.conditionList = res.conditionList
      this.dimParams = res.dimHTMLList
      // 维度
      this.dimParams.forEach(element => {
        if (element.dimDisabled == 2) {
          this.checkedDim.push(element.colName)
        }
      })
      this.indexParams = res.kpiHTMLList
      this.handleFilterCondition()
    },
    handleFilterCondition() {
      let conditionTypeTwoArr = [
        1,
        7,
        8,
        11,
        16,
        17,
        18,
        20,
        22,
        23,
        26,
        27,
        19,
        24,
        14,
        15
      ]
      let conditionTypeOneArr = [2, 21]
      let conditionType = this.conditionList[0].conditionType
      let today = new Date()
      nextTick(() => {
        conditionTypeTwoArr.includes(conditionType)
          ? (this.dateParamVisible = true)
          : (this.dateParamVisible = false)
        conditionTypeOneArr.includes(conditionType)
          ? (this.dateOptionVisible = true)
          : (this.dateOptionVisible = false)
        console.log('this.dateOptionVisible: ', this.dateOptionVisible)
      })
      // 昨天
      if ([1, 7, 8].includes(conditionType)) {
        today.setDate(today.getDate() - 1)
        this.searchForm.dateParam = [
          dayjs(today).format('YYYY-MM-DD'),
          dayjs(today).format('YYYY-MM-DD')
        ]
      }
      console.log('this.searchForm.dateParam: ', this.searchForm.dateParam)

      // 今天
      if (conditionType === 23) {
        this.searchForm.dateParam = [
          dayjs(today).format('YYYY-MM-DD'),
          dayjs(today).format('YYYY-MM-DD')
        ]
      }
      // 上月最后一天
      if (conditionType === 18) {
        today.setDate(0)
        this.searchForm.dateParam = [
          dayjs(today).format('YYYY-MM-DD'),
          dayjs(today).format('YYYY-MM-DD')
        ]
      }
      // 上周一到周日
      if (conditionType === 20) {
        today = this.getFirstDayOfWeek(today)
        this.searchForm.dateParam = [
          dayjs(today.setDate(today.getDate() - 7)).format('YYYY-MM-DD'),
          dayjs(today.setDate(today.getDate() - 1)).format('YYYY-MM-DD')
        ]
      }
      // 最近30天
      if (conditionType === 11) {
        this.searchForm.dateParam = [
          dayjs(today.setDate(today.getDate() - 30)).format('YYYY-MM-DD'),
          dayjs(today.setDate(today.getDate() - 1)).format('YYYY-MM-DD')
        ]
      }
      // 最近7天
      if (conditionType === 16) {
        this.searchForm.dateParam = [
          dayjs(today.setDate(today.getDate() - 7)).format('YYYY-MM-DD'),
          dayjs(today.setDate(today.getDate() - 1)).format('YYYY-MM-DD')
        ]
      }
      // 7天前的7天
      if (conditionType === 26) {
        this.searchForm.dateParam = [
          dayjs(today.setDate(today.getDate() - 14)).format('YYYY-MM-DD'),
          dayjs(today.setDate(today.getDate() - 14)).format('YYYY-MM-DD')
        ]
      }
      // 17、22 /17:比较时间段条件   22:到期时间
      // 昨天时间  1个日期 beginTimeValue 开始时间
      if (conditionType === 27) {
        today.setDate(today.getDate() - 1)
        this.searchForm.dateParam = [dayjs(today).format('YYYY-MM-DD'), '']
      }
      // 1个日期 beginTimeValue 开始时间
      if (conditionType === 19) {
        today.setDate(0)
        this.searchForm.dateParam = [dayjs(today).format('YYYY-MM-DD'), '']
      }
      // 24 其它时间段条件 1个日期 beginTimeValue 开始时间
      // 14、15 拉链表开始时间、拉链表结束时间 1个日期 beginTimeValue 开始时间

      // 获取表数据
      this.searchData()
    },
    getFirstDayOfWeek(date) {
      let weekday = date.getDay() || 7 //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1) //往前算（weekday-1）天，年份、月份会自动变化
      return date
    },
    //  3、4、5、6 //3:字符串等于// 4：数字等于 //5:大于 //6:小于 colBizName OlapModelCondition
    //  10 输入值：1,5  1 <= x <= 5
    handleInputString(value) {},
    handleSizeChange(val: number) {
      this.pagination.pageSize = val
      this.searchData()
    },
    handleCurrentChange(val: number) {
      this.pagination.page = val
      this.searchData()
    },
    onSearch() {
      console.log(this.searchForm)
      this.searchData()
    },
    onSortChange({ order, prop }) {
      this.sortField[prop] = order
      console.log(this.sortField)
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      } else {
        column.order = ''
      }
    },
    handleCheckedFieldChange(value: string[]) {
      const checkedCount = value.length
      this.checkFieldAll = checkedCount === this.indexParams.length
      this.isFieldIndeterminate =
        checkedCount > 0 && checkedCount < this.indexParams.length
      console.log(this.checkedFields)
    },
    handleCheckAllChange(value: boolean) {
      if (value) {
        this.indexParams.forEach(element => {
          this.checkedFields.push(element.colName)
        })
      } else {
        this.checkedFields = []
      }
      // this.checkedFields = value ? this.indexParams : []
      this.isFieldIndeterminate = false
      console.log(this.checkedFields, '指标')
    },
    handleCheckedDimChange(value: string[]) {
      const checkedCount = value.length
      this.checkDimAll = checkedCount === this.dimParams.length
      this.isDimIndeterminate =
        checkedCount > 0 && checkedCount < this.dimParams.length
      console.log(this.checkedDim)
    },
    handleCheckAllChangeDim(value: boolean) {
      if (value) {
        this.dimParams.forEach(element => {
          this.checkedDim.push(element.colName)
        })
      } else {
        this.checkedDim = []
      }
      this.isDimIndeterminate = false
      console.log(this.checkedDim, '维度')
    },
    changeOrderFlag(order, index) {
      switch (order.colOrderFlag) {
        case 0:
          this.orderParams[index].colOrderFlag = 1
          break
        case 1:
          this.orderParams[index].colOrderFlag = 2
          break
        case 2:
          this.orderParams[index].colOrderFlag = 0
          break
        default:
          this.orderParams[index].colOrderFlag = 1
      }
    },
    dragstart(item) {
      this.clickVal = item
    },
    dragenter(item) {
      this.moveVal = item
    },
    dragend(item) {
      this.endVal = item
      let index = this.orderParams.indexOf(item) //移动元素的当前位置
      let moveObj = this.moveVal ? this.moveVal : ''
      let addIndex = this.orderParams.indexOf(moveObj) //要移动后的位置
      this.orderParams.splice(index, 1)
      this.orderParams.splice(addIndex, 0, item)
    }
  }
})
</script>

<style lang="scss">
.pagination {
  text-align: right;
  margin-top: 10px;
}
.groupclass {
  display: flex;
  align-items: center;
}

.inputTag {
  border-radius: 4px;
  /* min-height: 40px; */
  width: 260px;
  height: 36px;
  line-height: 22px;
  display: inline-block;
  border: 1px solid #dcdfe6;
}
</style>
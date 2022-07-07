<template>
  <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
    <div style="display: inline" v-if="dateParamVisible">
      <el-form-item :label="searchForm.colBizName" prop="beginTimeValue">
        <el-date-picker v-model="searchForm.beginTimeValue" :clearable="false" type="date" placeholder="选择日期" class="demo-form-date"></el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="endTimeValue" v-if="searchForm.endTimeValue" size="small">
        <el-date-picker v-model="searchForm.endTimeValue" type="date" :clearable="false" style="width:200px" class="demo-form-date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
    </div>
    <div style="display: inline" v-if="dateOptionVisible">
      <el-form-item label="年：" prop="yearDateValue">
        <el-select v-model="searchForm.yearDateValue " class="demo-date-select" placeholder="年">
          <el-option v-for="(item, index) in yearList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月：" prop="monthDateValue">
        <el-select v-model="searchForm.monthDateValue " class="demo-date-select" placeholder="月">
          <el-option value="-1" label="全部"></el-option>
          <el-option v-for="(item, index) in menthList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <el-form-item v-if="optionParams.length">
      <el-popover placement="right" width="400px" trigger="click">
        <template #reference>
          <el-button type="info" plain>过滤条件</el-button>
        </template>
        <el-row justify="left">
          <el-col :span="12">
            <span>请选择过滤条件</span>
          </el-col>
        </el-row>
        <div v-for="(item,index) in optionParams" :key="index">
          <el-form-item :label="item.colBizName" label-width="100px" prop="filterParams" v-if="conditionTextType.includes(item.conditionType)">
            <el-input v-model="item.filterParams" @input="handleInputString" placeholder="请输入过滤条件"></el-input>
          </el-form-item>
          <el-form-item :label="item.colBizName" label-width="100px" prop="filterParams" v-if="item.conditionType === 12">
            <InputTag v-model="item.filterParams" :valueType="'string'" :add-tag-on-blur="true" :allow-duplicates="true" class="itemIput inputTag" placeholder="可用回车输入多条" />
          </el-form-item>
          <el-form-item :label="item.colBizName" label-width="100px" prop="filterParams" v-if="!item.conditionType">
            <el-select :popperAppendToBody="false" v-model="item.filterParams" @focus="getOptionSelectData(item, index)" multiple filterable clearable placeholder="请选择">
              <el-option :value="pitem" :label="pitem" v-for="(pitem, pindex) in item.optionSelectData" :key="pindex"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="item.colBizName"
            label-width="100px"
            prop="filterParams"
            v-if="conditiondataTextType.includes(item.conditionType) || conditiondataTextSingleType.includes(item.conditionType) "
          >
            <el-date-picker v-model="item.filterParams" :clearable="false" type="date" placeholder="选择日期" class="demo-form-date"></el-date-picker>
          </el-form-item>
        </div>
      </el-popover>
    </el-form-item>
    <el-form-item v-if="dimParams.length">
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
    <el-form-item v-if="indexParams.length">
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
    <el-form-item v-if="orderParams.length">
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
  <el-table
    :data="tableData"
    fit
    border
    stripe
    ref="table"
    :height="tableHeight"
    :header-cell-class-name="handleHeadAddClass"
    :header-cell-style="{background:'#eeeeee',color:'#000', border:'1px solid #ddd'}"
    :cell-style="cellStyle"
    @sort-change="onSortChange"
    :span-method="objectSpanMethod"
    highlight-current-row
    size="small"
  >
    <template v-for="column in columnDatas" :key="column.tabID">
      <el-table-column :fixed="column.fixed" :prop="column.colName" :label="column.colBizName" :sortable="column.sortable" />
    </template>
  </el-table>
  <div class="pagination">
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
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
  defineAsyncComponent
} from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import {
  // getReportColumns,
  getReportSearchData,
  getAnalysisModelColumn,
  getOptionSelect
} from '@/api/api'
import { IResponse, IModelSearch } from '@/api/type'
import { ElMessage, ElLoading } from 'element-plus'
import order0 from '@/static/image/order0.gif'
import order1 from '@/static/image/order1.gif'
import order2 from '@/static/image/order2.gif'
const InputTag = defineAsyncComponent(() => import('./components/InputTag.vue'))
import dayjs from 'dayjs'
export default defineComponent({
  name: 'TableData',
  components: { InputTag },
  data() {
    return {
      searchForm: {
        beginTimeValue: '',
        endTimeValue: '',
        colBizName: '',
        yearDateValue: '',
        monthDateValue: ''
      }, // 查询条件报表数据
      dateParamVisible: true,
      dateOptionVisible: false,
      value2: '',
      // columnDatas: [], // 记录表头数据
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
    const tableHeight: Number = 0 // 表格高度根据屏幕自适应
    const clickVal = ref<string>()
    const moveVal = ref<string>()
    const endVal = ref<string>()
    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })
    const columnDatas: any = ref([]) // 记录表头数据
    const dateTextConditionHTMLList: any = ref([])
    const dateOptionConditioHTMLList: any = ref([]) // 下拉年月日期条件
    const columnArr = ref([]) // 合并列
    const yearList = ref([
      { value: 2008, text: '2008年' },
      { value: 2009, text: '2009年' },
      { value: 2010, text: '2010年' },
      { value: 2011, text: '2011年' },
      { value: 2012, text: '2012年' },
      { value: 2013, text: '2013年' },
      { value: 2014, text: '2014年' },
      { value: 2015, text: '2015年' },
      { value: 2016, text: '2016年' },
      { value: 2017, text: '2017年' },
      { value: 2018, text: '2018年' },
      { value: 2019, text: '2019年' },
      { value: 2020, text: '2020年' },
      { value: 2021, text: '2021年' },
      { value: 2022, text: '2022年' },
      { value: 2023, text: '2023年' },
      { value: 2024, text: '2024年' },
      { value: 2025, text: '2025年' },
      { value: 2026, text: '2026年' },
      { value: 2027, text: '2027年' },
      { value: 2028, text: '2028年' },
      { value: 2029, text: '2029年' },
      { value: 2030, text: '2030年' }
    ])
    const menthList = ref([
      { value: 1, text: '1月' },
      { value: 2, text: '2月' },
      { value: 3, text: '3月' },
      { value: 4, text: '4月' },
      { value: 5, text: '5月' },
      { value: 6, text: '6月' },
      { value: 7, text: '7月' },
      { value: 8, text: '8月' },
      { value: 9, text: '9月' },
      { value: 10, text: '10月' },
      { value: 11, text: '11月' },
      { value: 12, text: '12月' }
    ])
    const conditionTextType: any = ref([3, 4, 5, 6, 9, 10, 13]) // 字符输入类型
    const conditiondataTextType = ref([1, 7, 8, 11, 16, 17, 18, 20, 22, 23, 26]) // 两个日期类型
    const conditiondataTextSingleType: any = ref([27, 19, 24, 14, 15]) // 一个日期类型
    const conditiondateOptionType: any = ref([2, 21]) // 年月下拉选日期类型
    const optionHTMLList: any = ref([]) // 备份过滤下拉条件
    const textConditionHTMLList: any = ref([]) // 备份输入条件
    // const dateParam: any = ref([]) // 记录日期字段
    const optionParams: any = ref([]) // 记录过滤条件数据
    // const dimParams: any = ref([]) // 记录维度数据
    // const indexParams: any = ref([]) // 记录指标数据
    // const orderParams: any = ref([]) // 记录排序指标
    // const checkedorders: any = ref([]) // 排序勾选值
    // const checkedDim: any = ref([]) // 选中的维度
    // const conditionList: any = ref([]) // 日期条件list
    const loading: any = ref()
    const tableData: any = ref([])
    const getTableData = async (params: IModelSearch) => {
      const res: IResponse = await getReportSearchData(params)
      columnArr.value = []
      tableData.value = []
      if (res.code === 0) {
        console.log('res: ', res)
        res.analysisModel.rowList.forEach(citem => {
          const rowListData = {}
          columnDatas.value = []
          citem.fieldValueList.forEach(item => {
            rowListData[item.column.colName] = item.value
            if (!columnDatas.value.includes(item.column)) {
              columnDatas.value.push(item.column)
            }
          })
          tableData.value.push(rowListData)
        })
        if (res.analysisModel.totalRow) {
          const totalRowListData = {}
          res.analysisModel.totalRow.fieldValueList.forEach((citem, cindex) => {
            columnDatas.value.forEach((item, index) => {
              if (cindex === index) {
                totalRowListData[item.colName] = citem.value
                if (citem.value === 'TOTAL') {
                  item['fixed'] = true
                } else {
                  item['fixed'] = false
                }
              }
            })
          })
          tableData.value.push(totalRowListData)
        }
        pagination.total = Number(res.analysisModel.totalList[0])
      }
    }
    const getOptionSelectData = async (params: any, index: number) => {
      if (params.optionSelectData.length) return
      const res: IResponse = await getOptionSelect(params.colRefTab)
      if (res.code === 0) {
        params.optionSelectData = res.data
        optionParams[index] = params
      } else {
        return ElMessage.error({ message: res.msg })
      }
    }

    return {
      modelId,
      columnDatas,
      tableData,
      columnArr,
      menthList,
      yearList,
      conditionTextType,
      conditiondataTextType,
      conditiondataTextSingleType,
      conditiondateOptionType,
      optionHTMLList,
      textConditionHTMLList,
      // getColumns,
      getTableData,
      // dimParams,
      optionParams,
      // indexParams,
      // orderParams,
      // checkedorders,
      order0,
      order1,
      order2,
      dayjs,
      clickVal,
      moveVal,
      endVal,
      dateTextConditionHTMLList,
      dateOptionConditioHTMLList,
      ...toRefs(pagination),
      getOptionSelectData,
      loading,
      tableHeight
      // dateParam
      // checkedDim,
      // handleFilterCondition,
      // conditionList
    }
  },
  mounted() {
    this.loading = ElLoading.service({ fullscreen: true })
    // 获取表头数据
    this.getColumns()
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 120
      // 监听窗口大小变化
      let self = this
      window.onresize = function() {
        self.tableHeight =
          window.innerHeight - self.$refs.table.$el.offsetTop - 120
      }
    })
    //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    //50表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度
  },
  methods: {
    // 搜索数据
    searchData() {
      let params: IModelSearch = {
        modelID: Number(this.modelId),
        pageNo: this.page,
        pageRows: this.pageSize,
        dimCodeJSON: {}, // 维度入参
        kpiCodeJSON: {}, // 指标入参
        dateTextJSON: {}, // 统计日期
        dateOptionJSON: {}, // 下拉日期
        optionJSON: {}, // 过滤条件为下拉选
        textJSON: {}, // 过滤条件是输入框
        orderJSON: {}, // 排序入参
        compareTextJson: {}
      }
      console.log('过滤条件', this.optionParams)
      // 统计日期
      if (this.searchForm.beginTimeValue) {
        params.dateTextJSON = {
          beginTimeKey: this.dateTextConditionHTMLList[0].beginTimeKey,
          beginTimeValue: this.searchForm.beginTimeValue
        }
        if (this.dateTextConditionHTMLList[0].endTimeValue) {
          params.dateTextJSON.endTimeValue = this.searchForm.endTimeValue
          params.dateTextJSON.endTimeKey = this.dateTextConditionHTMLList[0].endTimeKey
        }
      }
      // 年月下拉日期
      if (this.searchForm.yearDateValue) {
        params.dateOptionJson = {
          yearDateKey: this.dateTextConditionHTMLList[0].yearDateKey,
          yearDateValue: this.searchForm.yearDateValue,
          monthDateKey: this.dateTextConditionHTMLList[0].monthDateKey,
          monthDateValue: this.searchForm.monthDateValue
        }
      }
      // 过滤条件
      if (this.optionParams.length) {
        let filterParamsData = []
        this.optionParams.filter(item => {
          if (!item.conditionType) {
            item.filterParams.length
              ? filterParamsData.push(item)
              : filterParamsData
          } else {
            item.filterParams ? filterParamsData.push(item) : filterParamsData
          }
        })
        console.log('filterParamsData: ', filterParamsData)
        if (filterParamsData.length) {
          let optionJSONData = {}
          let optionJSONDataIndex = 0
          let textJSONData = {}
          let textJSONDataIndex = 0
          filterParamsData.forEach(item => {
            if (!item.conditionType) {
              let citem = this.optionHTMLList.filter(
                element => element.colBizName === item.colBizName
              )[0]
              for (let key in citem) {
                if (!item[key]) {
                  citem[key] = ''
                }
              }
              let filterParamsIndex = []
              item.optionSelectData.forEach((fitem, findex) => {
                if (item.filterParams.includes(fitem)) {
                  filterParamsIndex.push(findex)
                }
              })
              optionJSONData[optionJSONDataIndex] = {
                column: JSON.stringify(citem),
                value: filterParamsIndex.join(',')
              }
              optionJSONDataIndex = optionJSONDataIndex + 1
            } else {
              this.textConditionHTMLList.filter(element => {
                if (Object.keys(element)[0] == item.colBizName) {
                  textJSONData[textJSONDataIndex] = {
                    column: element[Object.keys(element)[0]],
                    value: item.filterParams,
                    type: item.type
                  }
                }
              })
              textJSONDataIndex = textJSONDataIndex + 1
            }
          })
          params.optionJSON = optionJSONData
          params.textJSON = textJSONData
          console.log('params: ', params)
        }
      }
      // 排序
      if (this.checkedorders.length) {
        let orderDataJSON = {}
        let orderindex = 0
        this.orderParams.filter(item => {
          if (this.checkedorders.indexOf(item.colName) > -1) {
            for (let key in item) {
              if (!item[key]) {
                item[key] = ''
              }
            }
            orderDataJSON[orderindex] = {
              column: JSON.stringify(item),
              value: JSON.stringify(item.colOrderFlag)
            }
            orderindex = orderindex + 1
          }
        })
        params.orderJSON = orderDataJSON
      }
      // 指标
      if (this.checkedFields.length) {
        let kpiCodeDataJSON = {}
        let kpiIndex = 0
        this.indexParams.filter(item => {
          if (this.checkedFields.indexOf(item.colName) > -1) {
            for (let key in item) {
              if (!item[key]) {
                item[key] = ''
              }
            }
            kpiCodeDataJSON[kpiIndex] = JSON.stringify(item)
            kpiIndex = kpiIndex + 1
          }
        })
        params.kpiCodeJSON = kpiCodeDataJSON
      }
      // 维度
      if (this.checkedDim.length) {
        let dimCodeDataJSON = {}
        let dimIndex = 0
        this.dimParams.filter(item => {
          if (this.checkedDim.indexOf(item.colName) > -1) {
            for (let key in item) {
              if (!item[key]) {
                item[key] = ''
              }
            }
            dimCodeDataJSON[dimIndex] = JSON.stringify(item)
            dimIndex = dimIndex + 1
          }
        })
        params.dimCodeJSON = dimCodeDataJSON
      }
      this.getTableData(params)
    },
    async getColumns() {
      const res: IResponse = await getAnalysisModelColumn(this.modelId)
      console.log('res:报表 ', res)
      if (res.code === 500) {
        this.loading.close()
        return ElMessage.error({ message: res.msg })
      }
      res.headRows.forEach(item => {
        item.colBizNameData = ''
      })
      this.columnDatas = res.headRows
      // 过滤条件
      this.optionHTMLList = res.optionHTMLList
      if (res.optionHTMLList.length) {
        res.optionHTMLList.forEach(item => {
          item['filterParams'] = ''
          item['type'] = ''
          item['optionSelectData'] = []
          if (this.conditiondataTextType.includes(item.conditionType)) {
            let itemBegin = item
            itemBegin.colBizName = itemBegin.colBizName + '开始'
            itemBegin.type = 'from'
            let itemEnd = item
            itemEnd.colBizName = itemEnd.colBizName + '结束'
            itemEnd.type = 'to'
            this.optionParams.push(itemBegin)
            this.optionParams.push(itemEnd)
          } else {
            this.optionParams.push(item)
          }
        })
      }
      this.textConditionHTMLList = res.textConditionHTMLList
      if (res.textConditionHTMLList.length) {
        res.textConditionHTMLList.forEach(item => {
          let key = Object.keys(item)
          let citem = JSON.parse(item[key])
          citem['filterParams'] = ''
          citem['type'] = ''
          this.optionParams.push(citem)
        })
      }
      //  排序
      this.orderParams = res.orderHTMLList
      this.orderParams.forEach(element => {
        if (element.colOrderFlag) {
          this.checkedorders.push(element.colName)
        }
      })

      // 维度
      this.dimParams = res.dimHTMLList
      this.dimParams.forEach(element => {
        if (element.dimDisabled == 2) {
          this.checkedDim.push(element.colName)
        }
        this.handleCheckedDimChange(this.checkedDim)
      })
      // 指标
      this.indexParams = res.kpiHTMLList
      this.indexParams.forEach(element => {
        this.checkedFields.push(element.colName)
      })
      this.handleCheckedFieldChange(this.checkedFields)
      // 统计日期
      this.conditionList = res.conditionList
      if (res.conditionList.length) {
        this.searchForm.colBizName = res.conditionList[0].colBizName
      }
      console.log('this.searchForm: ', this.searchForm)
      this.dateTextConditionHTMLList = res.dateTextConditionHTMLList
      this.dateOptionConditioHTMLList = ref.dateOptionConditioHTMLList
      if (res.dateTextConditionHTMLList.length) {
        this.searchForm.beginTimeValue =
          res.dateTextConditionHTMLList[0].beginTimeValue
        if (res.dateTextConditionHTMLList[0].endTimeValue) {
          this.searchForm.endTimeValue =
            res.dateTextConditionHTMLList[0].endTimeValue
        }
        this.dateParamVisible = true
      } else {
        this.dateParamVisible = false
      }
      // 下拉年月日期条件
      if (res.dateOptionConditioHTMLList.length) {
        this.searchForm.yearDateValue =
          res.dateTextConditionHTMLList[0].yearDateValue
        this.searchForm.monthDateValue =
          res.dateTextConditionHTMLList[0].monthDateValue
        this.dateOptionVisible = true
      } else {
        this.dateOptionVisible = false
      }
      // this.handleFilterCondition()
      // 获取表数据
      this.searchData()
    },
    handleFilterCondition() {
      let conditionType = this.conditionList[0].conditionType
      let today = new Date()
      nextTick(() => {
        this.conditiondataTextType.includes(conditionType) ||
        this.conditiondataTextSingleType.includes(conditionType)
          ? (this.dateParamVisible = true)
          : (this.dateParamVisible = false)
        this.conditiondateOptionType.includes(conditionType)
          ? (this.dateOptionVisible = true)
          : (this.dateOptionVisible = false)
      })
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
      this.pageSize = val
      this.searchData()
    },
    handleCurrentChange(val: number) {
      this.page = val
      this.searchData()
    },
    onSearch() {
      this.searchData()
    },
    onSortChange({ order, prop }) {
      this.sortField[prop] = order
      console.log(this.sortField)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.fixed && !this.columnArr.includes(columnIndex)) {
        this.columnArr.push(columnIndex)
      }
      this.columnArr.sort(function(a, b) {
        /*
         * return b-a; —> 降序排序
         * return a-b; —> 升序排列
         */
        return a - b
      }) //括号里不写回调函数则默认按照字母逐位升序排列
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === this.columnArr[this.columnArr.length - 1]) {
          return [1, this.columnArr.length]
        } else if (columnIndex < this.columnArr[this.columnArr.length - 1]) {
          return [0, 0]
        }
      }
    },
    //设置指定行、列、具体单元格颜色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex <= this.columnArr[this.columnArr.length - 1]) {
        return 'background:#EEEEEE'
      } else {
        return ''
      }
    },
    getNodeSummaries({ columns, data }) {},
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
    },
    handleCheckedDimChange(value: string[]) {
      const checkedCount = value.length
      this.checkDimAll = checkedCount === this.dimParams.length
      this.isDimIndeterminate =
        checkedCount > 0 && checkedCount < this.dimParams.length
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
.el-table .cell {
  padding: 0 !important;
  height: 40px;
  line-height: 40px !important;
  text-align: center;
}
.demo-form-date {
  width: 130px !important;
}
.demo-date-select {
  width: 100px !important;
}
.el-table .el-table__cell {
  padding: 0;
}
</style>
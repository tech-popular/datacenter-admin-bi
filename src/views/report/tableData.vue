<template>
  <div class="table-data" v-loading="loading">
    <el-form :inline="true" :model="searchForm" label-position="right" class="demo-form-inline" size="small">
      <div class="elform-inline" v-if="dateParamVisible">
        <el-form-item v-for="(item, index) in dataSearchForm" :key="index">
          <el-form-item :label="item.colBizName" prop="beginTimeValue" style="margin-right: 10px">
            <el-date-picker v-model="item.beginTimeValue" :shortcuts="shortcuts" clearable @change="changeBeginTimeValue(item, index)" type="date" placeholder="选择日期" class="demo-form-date"></el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="endTimeValue" v-if="conditiondataTextType.includes(item.conditionType)" size="small">
            <el-date-picker v-model="item.endTimeValue" :shortcuts="shortcuts" @change="changeEndTimeValue(item, index)" clearable type="date" placeholder="选择日期" class="demo-form-date"></el-date-picker>
          </el-form-item>
        </el-form-item>
      </div>
      <el-form-item class="elform-inline" v-if="dateOptionVisible">
        <el-form-item label="年：" prop="yearDateValue">
          <el-select v-model="searchForm.yearDateValue " class="demo-date-select" placeholder="年">
            <el-option v-for="(item, index) in yearList" :key="index" :value="item.value" :label="item.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月：" prop="monthDateValue">
          <el-select v-model="searchForm.monthDateValue " class="demo-date-select" placeholder="月">
            <el-option value label="全部"></el-option>
            <el-option v-for="(item, index) in menthList" :key="index" :value="item.value" :label="item.text"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="optionParams.length">
        <el-popover v-if="isPopoverVisible" placement="bottom-start" :width="500" trigger="manual">
          <template #reference>
            <el-button type="info" plain @click="showPopover">过滤条件</el-button>
          </template>
          <el-row justify="start">
            <el-col :span="12">
              <span>请选择过滤条件</span>
            </el-col>
          </el-row>
          <div v-for="(item,index) in optionParams" :key="index">
            <el-form-item :label="item.colBizName" label-width="150px" prop="filterParams" v-if="conditionTextType.includes(item.conditionType)">
              <el-input v-model="item.filterParams" @input="handleInputString" clearable placeholder="请输入过滤条件"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="item.colBizName" label-width="150px" prop="filterParams" v-if="item.conditionType === 12">
              <InputTag
                v-model="item.filterParams"
                @change="inputTagChange"
                :indexNum="index"
                :indexColName="item.colName"
                :valueType="'string'"
                :add-tag-on-blur="true"
                :allow-duplicates="true"
                class="itemIput inputTag"
                placeholder="可用回车输入多条"
              />
            </el-form-item>-->
            <el-form-item :label="item.colBizName" label-width="150px" prop="filterParams" v-if="!item.conditionType">
              <el-select :teleported="false" v-model="item.filterParams" @focus="getOptionSelectData(item, index)" multiple filterable clearable placeholder="请选择">
                <el-option :value="pitem.column1" :label="pitem.column2" v-for="(pitem, pindex) in item.optionSelectData" :key="pindex"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="item.colBizName"
              label-width="150px"
              prop="filterParams"
              v-if="conditiondataTextType.includes(item.conditionType) || conditiondataTextSingleType.includes(item.conditionType) "
            >
              <el-date-picker class="option-form-date" v-model="item.filterParams" :clearable="false" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
          <!-- 添加关闭按钮 -->
          <el-button type="text" @click="hidePopover">关闭</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item v-if="dimParams.length || indexParams.length">
        <el-popover placement="bottom-end" :width="400" trigger="click" popper-class="el_popover_class">
          <template #reference>
            <el-button type="info" plain>展示列</el-button>
          </template>
          <el-row justify="start">
            <el-col :span="12">
              <span>请选择展示列</span>
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
          <el-checkbox-group v-model="checkedFields" @change="handleCheckedFieldChange">
            <div v-for="field in indexParams" :key="field.name">
              <el-checkbox :label="field.colName">{{field.colBizName}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="onSearch">查询</el-button>
        <el-button type="primary" plain @click="downLoad">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="tableloading"
      element-loading-text="数据查询中，请稍等..."
      :data="tableData"
      fit
      border
      stripe
      width="auto"
      ref="tableRef"
      :max-height="tableHeight"
      sortable="custom"
      :header-cell-class-name="handleHeadAddClass"
      :header-cell-style="{background:'#eeeeee',color:'#000', border:'1px solid #ddd' }"
      :cell-style="cellStyle"
      @sort-change="onSortChange"
      :span-method="objectSpanMethod"
      highlight-current-row
      size="small"
      :header-align="center"
      scrollbar-always-on
    >
      <template v-for="(column, index) in columnDatas" :key="index">
        <el-table-column
          :min-width="flexColumnWidth(column.colBizName)"
          :fixed="column.fixed"
          show-overflow-tooltip
          align="center"
          :prop="column.colName"
          :label="column.colBizName"
          :sortable="column.sortable"
        />
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
  computed,
  onMounted
} from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import {
  // getReportColumns,
  getReportSearchData,
  getAnalysisModelColumn,
  getOptionSelect,
  downLoadRptForExcel
} from '@/api/api'
import { IResponse, IModelSearch } from '@/api/type'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import order0 from '@/static/image/order0.gif'
import order1 from '@/static/image/order1.gif'
import order2 from '@/static/image/order2.gif'
const InputTag = defineAsyncComponent(() => import('./components/InputTag.vue'))
import dayjs from 'dayjs'
// import { th } from 'element-plus/lib/locale'
export default defineComponent({
  name: 'TableData',
  components: { InputTag },
  data() {
    return {
      searchForm: {
        yearDateValue: '',
        monthDateValue: ''
      }, // 查询条件报表数据
      dateParamVisible: true,
      dateOptionVisible: false,
      value2: '',
      // columnDatas: [], // 记录表头数据
      // dimParams: [], // 记录维度数据
      indexParams: [], // 记录指标数据
      // checkedDim: [], // 选中的维度
      sortField: {}, // 记录排序的字段
      // 指标
      // checkedFields: [], // 选中的指标
      checkFieldAll: false, // 全选状态
      isFieldIndeterminate: false, // 全选状态
      // 维度
      checkDimAll: false, // 全选状态
      isDimIndeterminate: false, // 全选状态
      tabNum: 1,
      isPopoverVisible: false // 控制 popover 显示的布尔值
    }
  },
  setup() {
    const route: RouteLocationNormalized = useRoute()
    const modelId: string = String(route.params.modelId)
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
      { value: '2008', text: '2008年' },
      { value: '2009', text: '2009年' },
      { value: '2010', text: '2010年' },
      { value: '2011', text: '2011年' },
      { value: '2012', text: '2012年' },
      { value: '2013', text: '2013年' },
      { value: '2014', text: '2014年' },
      { value: '2015', text: '2015年' },
      { value: '2016', text: '2016年' },
      { value: '2017', text: '2017年' },
      { value: '2018', text: '2018年' },
      { value: '2019', text: '2019年' },
      { value: '2020', text: '2020年' },
      { value: '2021', text: '2021年' },
      { value: '2022', text: '2022年' },
      { value: '2023', text: '2023年' },
      { value: '2024', text: '2024年' },
      { value: '2025', text: '2025年' },
      { value: '2026', text: '2026年' },
      { value: '2027', text: '2027年' },
      { value: '2028', text: '2028年' },
      { value: '2029', text: '2029年' },
      { value: '2030', text: '2030年' }
    ])
    const menthList = ref([
      { value: '1', text: '1月' },
      { value: '2', text: '2月' },
      { value: '3', text: '3月' },
      { value: '4', text: '4月' },
      { value: '5', text: '5月' },
      { value: '6', text: '6月' },
      { value: '7', text: '7月' },
      { value: '8', text: '8月' },
      { value: '9', text: '9月' },
      { value: '10', text: '10月' },
      { value: '11', text: '11月' },
      { value: '12', text: '12月' }
    ])
    const shortcuts = [
      {
        text: 'Today',
        value: new Date()
      },
      {
        text: 'Yesterday',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return date
        }
      },
      {
        text: 'A week ago',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          return date
        }
      }
    ]
    const conditionTextType: any = ref([3, 4, 5, 6, 9, 10, 12, 13]) // 字符输入类型
    const conditiondataTextType = ref([1, 7, 8, 11, 16, 17, 18, 20, 22, 23, 26]) // 两个日期类型
    const conditiondataTextSingleType: any = ref([27, 19, 24, 14, 15]) // 一个日期类型
    const conditiondateOptionType: any = ref([2, 21]) // 年月下拉选日期类型
    const optionHTMLList: any = ref([]) // 备份过滤下拉条件
    const textConditionHTMLList: any = ref([]) // 备份过滤输入条件
    const otherDateTextConditionHTMLList: any = ref([]) // 备份过滤日期条件
    const dataSearchForm: any = ref([]) // 日期条件
    const optionParams: any = ref([]) // 记录过滤条件数据
    const orderParams: any = ref([]) // 记录排序指标
    const showColumns: any = ref([]) // 记录展示列数据
    const checkedFields: any = ref([]) // 选中的指标
    const dimParams: any = ref([]) // 记录维度数据
    // const indexParams: any = ref([]) // 记录指标数据
    const checkedDim: any = ref([]) // 选中的维度
    const loading: any = ref()
    const tableData: any = ref([])
    const totalList: any = ref([]) // 查询报表数据的totalList
    const totalRow: any = ref([]) // 查询报表数据的totalRow
    const dimPlayBackData: any = ref([]) // 查询报表数据回显的指标（为统一字段名）
    const tableRef = ref(null)
    let tableHeight: Number = window.innerHeight - 260
    const tableloading = ref(false)
    //或者
    //泛型默认值语法<T = any>
    // type Ref<T = any> = {
    // value : T
    // }
    // const tableRef: Ref<div | null> = ref(null);
    const getTableData = async (params: IModelSearch) => {
      tableloading.value = true
      const res: IResponse = await getReportSearchData(params)
      columnArr.value = []
      tableData.value = []
      columnDatas.value = []
      if (res.code === 0) {
        columnDatas.value = res.analysisModel.headRows
        res.analysisModel.rowList.forEach(citem => {
          const rowListData = {}
          totalList.value = res.analysisModel.totalList
          totalRow.value = res.analysisModel.totalRow
          citem.fieldValueList.forEach(item => {
            rowListData[item.column.colName] = item.value
            if (
              item.column.colFlag === 'dim' &&
              !dimPlayBackData.value.includes(item.column.colName)
            ) {
              dimPlayBackData.value.push(item.column.colName)
            }
          })
          tableData.value.push(rowListData)
        })
        if (res.analysisModel.totalRow) {
          const totalRowListData = {}
          let fixedIndex = 0
          let totalNumber = 0
          res.analysisModel.totalRow.fieldValueList.forEach((citem, cindex) => {
            columnDatas.value.forEach((item, index) => {
              if (cindex === index) {
                item['fixed'] = false
                if (citem.value === 'TOTAL') {
                  if (item.colFlag === 'dim') {
                    fixedIndex = fixedIndex + 1
                    if (fixedIndex < 7) {
                      item['fixed'] = 'left'
                    }
                  }
                  totalNumber === 0
                    ? (totalRowListData[item.colName] = 'TOTAL')
                    : (totalRowListData[item.colName] = '')
                  totalNumber = totalNumber + 1
                } else {
                  totalRowListData[item.colName] = citem.value
                }
              }
            })
          })
          tableData.value.push(totalRowListData)
        }
        // 判断totalList的值是否有效
        let totalListValue: Boolean = false
        if (
          res.analysisModel.totalList.length &&
          res.analysisModel.totalList.length > 1
        ) {
          res.analysisModel.totalList.forEach((item, index) => {
            if (index > 0 && item) {
              totalListValue = true
            }
          })
        }
        if (
          res.analysisModel.totalList.length &&
          res.analysisModel.totalList.length > 1 &&
          totalListValue
        ) {
          const totalListData = {}
          let totalListIndex = 0
          let fixedIndex = 0
          let totalNumber = 0
          columnDatas.value.forEach((item, index) => {
            item['fixed'] = false
            if (item.colFlag === 'kpi') {
              totalListIndex = totalListIndex + 1
              totalListData[item.colName] =
                res.analysisModel.totalList[totalListIndex]
            } else {
              if (item.colFlag === 'dim') {
                fixedIndex = fixedIndex + 1
                if (fixedIndex < 6) {
                  item['fixed'] = 'left'
                }
              }
              totalNumber === 0
                ? (totalListData[item.colName] = 'TOTAL')
                : (totalListData[item.colName] = '')
              totalNumber = totalNumber + 1
            }
          })
          tableData.value.push(totalListData)
        }
        // 给表头添加排序功能
        columnDatas.value.forEach((item, index) => {
          orderParams.value.filter(orderitem => {
            if (item.colBizName === orderitem.colBizName) {
              item['sortable'] = 'custom'
            }
          })
        })
        pagination.total = Number(res.analysisModel.portalPage.totalRows)
        tableloading.value = false
      } else {
        ElMessageBox.confirm(`${res.msg},'请稍后再试'`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            tableloading.value = false
          })
          .catch(() => {
            tableloading.value = false
          })
      }
    }

    const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (
        dimPlayBackData.value.includes(column.property) &&
        !columnArr.value.includes(columnIndex)
      ) {
        columnArr.value.push(columnIndex)
      }
      columnArr.value.sort(function(a, b) {
        /*
         * return b-a; —> 降序排序
         * return a-b; —> 升序排列
         */
        return a - b
      }) //括号里不写回调函数则默认按照字母逐位升序排列
      // if (
      //   rowIndex === tableData.value.length - 1 &&
      //   (totalList.value.length > 1 || totalRow.value)
      // ) {
      //   if (columnIndex === columnArr.value[columnArr.value.length - 1]) {
      //     cellStyle({ row, column, rowIndex, columnIndex })
      // return {
      //   rowspan: 1,
      //   colspan: columnArr.value.length
      // }
      //   } else if (columnIndex < columnArr.value[columnArr.value.length - 1]) {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
    }
    //设置指定行、列、具体单元格颜色
    const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
      if (
        rowIndex === tableData.value.length - 1 &&
        (totalList.value.length > 1 || totalRow.value)
      ) {
        if (columnIndex === columnArr.value[columnArr.value.length - 1]) {
          return {
            backgroundColor: ' #eeeeee',
            borderLeft: ' 0px solid #dddddd',
            borderRight: ' 1px solid #dddddd'
          }
        } else if (columnIndex < columnArr.value[columnArr.value.length - 1]) {
          return {
            backgroundColor: ' #eeeeee',
            border: ' 0px solid #dddddd'
          }
        }
      }
      if (columnIndex <= columnArr.value[columnArr.value.length - 1]) {
        return {
          backgroundColor: ' #eeeeee',
          border: ' 1px solid #dddddd'
        }
      } else {
        return {
          border: ' 1px solid #dddddd'
        }
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
    /**
     * 日期比较大小
     * compareDateString大于dateString，返回1；
     * 等于返回0；
     * compareDateString小于dateString，返回-1
     * @param dateString 日期
     * @param compareDateString 比较的日期
     */

    let dateCompare = (dateString, compareDateString) => {
      let dateTime = dayjs(dateString).format('YYYY-MM-DD')
      dateTime = dayjs(dateTime)
      let compareDateTime = dayjs(compareDateString).format('YYYY-MM-DD')
      if (dateTime.diff(compareDateTime, 'day') >= 0) {
        return 1
      } else {
        return -1
      }
    }
    let changeBeginTimeValue = (item, index) => {
      // let
      if (index > 0) {
        if (
          dateCompare(
            item.beginTimeValue,
            dataSearchForm.value[0].beginTimeValue
          ) === 1 &&
          dateCompare(
            item.beginTimeValue,
            dataSearchForm.value[0].endTimeValue
          ) === -1
        ) {
          dataSearchForm.value[index].beginTimeValue = item.beginTimeValue
        } else if (
          dateCompare(
            item.beginTimeValue,
            dataSearchForm.value[0].beginTimeValue
          ) === -1
        ) {
          dataSearchForm.value[index].beginTimeValue =
            dataSearchForm.value[0].beginTimeValue
        } else if (
          dateCompare(
            item.beginTimeValue,
            dataSearchForm.value[0].endTimeValue
          ) === 1
        ) {
          dataSearchForm.value[0].beginTimeValue = item.beginTimeValue
          dataSearchForm.value[0].endTimeValue = item.beginTimeValue
          dataSearchForm.value[index].endTimeValue = item.beginTimeValue
        }
      }
    }
    let changeEndTimeValue = (item, index) => {
      if (index > 0) {
        if (
          dateCompare(
            item.endTimeValue,
            dataSearchForm.value[0].beginTimeValue
          ) === -1
        ) {
          dataSearchForm.value[0].beginTimeValue = item.endTimeValue
          dataSearchForm.value[0].endTimeValue = item.endTimeValue
          dataSearchForm.value[index].beginTimeValue = item.endTimeValue
        } else if (
          dateCompare(
            item.endTimeValue,
            dataSearchForm.value[0].beginTimeValue
          ) === 1 &&
          dateCompare(
            item.endTimeValue,
            dataSearchForm.value[0].endTimeValue
          ) === -1
        ) {
          dataSearchForm.value[index].endTimeValue = item.endTimeValue
        } else if (
          dateCompare(
            item.endTimeValue,
            dataSearchForm.value[0].endTimeValue
          ) === 1
        ) {
          dataSearchForm.value[0].endTimeValue = item.endTimeValue
        }
      }
    }
    const downLoadTableData = async (params: IModelSearch) => {
      const res: IResponse = await downLoadRptForExcel(params)
      console.log('res: ', res)
      if (res.code !== 0) {
        ElMessageBox.confirm(`${res.msg},'请稍后再试'`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
    }
    onMounted(() => {
      document.oncopy = function() {
        event.returnValue = false
      }
      //另一种直接在body上 <body oncopy = "return false" ></body>
    })
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
      otherDateTextConditionHTMLList,
      dataSearchForm,
      getTableData,
      dimParams,
      optionParams,
      checkedFields,
      orderParams,
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
      changeBeginTimeValue,
      changeEndTimeValue,
      // dateParam
      checkedDim,
      totalList,
      totalRow,
      dimPlayBackData,
      tableRef,
      cellStyle,
      objectSpanMethod,
      shortcuts, // 日期快捷选择
      tableHeight, // 窗口高度调节报表高度
      tableloading, // 表格的loading
      downLoadTableData // 下载报表数据
    }
  },
  mounted() {
    this.loading = true
    // this.loading = ElLoading.service({ fullscreen: true })
    // 监听浏览器窗口变化，动态计算表格高度，
    // 250是表格外其它布局占的高度，这个数值根据自己实际情况修改
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 250
    })
    // 获取表头数据
    this.getColumns()
  },
  beforeDestroy() {
    // 移除绑定的listenResizeFn事件监听
    window.removeEventListener('resize', () => {
      this.tableHeight = 300
    })
  },
  methods: {
    showPopover() {
      this.isPopoverVisible = !this.isPopoverVisible;
    },
    hidePopover() {
      this.isPopoverVisible = false;
    },
    // 搜索数据
    getSearchData() {
      let params: IModelSearch = {
        modelID: Number(this.modelId),
        pageNo: this.page,
        pageRows: this.pageSize,
        dimCodeJSON: {}, // 维度入参
        kpiCodeJSON: {}, // 指标入参
        dateTextJSON: {}, // 统计日期
        // dateOptionJSON: {}, // 下拉日期
        optionJSON: {}, // 过滤条件为下拉选
        orderJSON: {}, // 排序入参
        compareTextJson: {}
      }
      // 统计日期
      if (this.dataSearchForm.length) {
        params.dateTextJSON = {
          beginTimeKey: this.dataSearchForm[0].beginTimeKey,
          beginTimeValue: dayjs(this.dataSearchForm[0].beginTimeValue).format(
            'YYYY-MM-DD'
          )
        }
        if (this.dateTextConditionHTMLList[0].endTimeValue) {
          params.dateTextJSON.endTimeValue = dayjs(
            this.dataSearchForm[0].endTimeValue
          ).format('YYYY-MM-DD')
          params.dateTextJSON.endTimeKey = this.dataSearchForm[0].endTimeKey
        }
      }
      // 年月下拉日期
      if (this.searchForm.yearDateValue) {
        params.dateOptionJson = {
          yearDateKey: this.dateOptionConditioHTMLList[0].yearDateKey,
          yearDateValue: this.searchForm.yearDateValue,
          monthDateKey: this.dateOptionConditioHTMLList[0].monthDateKey,
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
          } else if (item.conditionType === 12) {
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
              // let filterParamsIndex = []
              // item.optionSelectData.forEach((fitem, findex) => {
              //   if (item.filterParams.includes(fitem.column1)) {
              //     filterParamsIndex.push(findex)
              //   }
              // })
              optionJSONData[optionJSONDataIndex] = {
                column: JSON.stringify(citem),
                value: item.filterParams.join(',')
              }
              optionJSONDataIndex = optionJSONDataIndex + 1
            } else {
              this.textConditionHTMLList.filter(element => {
                if (Object.keys(element)[0] == item.colBizName) {
                  console.log(
                    ' item.filterParams.i ',
                    item.filterParams.indexOf('，') !== -1
                  )
                  console.log(
                    'item.filterParams.r ',
                    item.filterParams.replace('，', ',')
                  )
                  console.log(
                    ' item.filterParams.iwew ',
                    item.filterParams.replace('，', ',').indexOf('，') !== -1
                  )
                  textJSONData[textJSONDataIndex] = {
                    column: element[Object.keys(element)[0]],
                    value:
                      item.filterParams.indexOf('，') !== -1
                        ? item.filterParams.replace('，', ',')
                        : item.filterParams,
                    type: item.type
                  }
                }
              })
              this.otherDateTextConditionHTMLList.filter(element => {
                if (Object.keys(element)[0] == item.colBizName) {
                  textJSONData[textJSONDataIndex] = {
                    column: element[Object.keys(element)[0]],
                    value: dayjs(item.filterParams).format('YYYY-MM-DD'),
                    type: item.type
                  }
                }
              })
              textJSONDataIndex = textJSONDataIndex + 1
            }
          })
          params.optionJSON = optionJSONData
          params.textJSON = textJSONData
        }
      }
      // 排序
      if (this.orderParams.length) {
        let orderDataJSON = {}
        let orderindex = 0
        this.orderParams.filter(item => {
          if (Object.keys(this.sortField).indexOf(item.colName) > -1) {
            for (let key in item) {
              if (!item[key]) {
                item[key] = ''
              }
            }
            orderDataJSON[orderindex] = {
              column: JSON.stringify(item),
              value: this.sortField[item.colName] === 'ascending' ? '1' : '2'
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
      return params
    },
    async getColumns() {
      const res: IResponse = await getAnalysisModelColumn(this.modelId)
      if (res.code === 500) {
        this.loading = false
        return ElMessage.error({ message: res.msg })
      }
      this.columnDatas = res.headRows
      // 过滤条件
      this.optionHTMLList = res.optionHTMLList
      if (res.optionHTMLList.length) {
        res.optionHTMLList.forEach(item => {
          item['filterParams'] = ''
          item['type'] = ''
          item['optionSelectData'] = []
          this.optionParams.push(item)
        })
      }
      // 时间过滤条件
      if (res.otherDateTextConditionHTMLList.length) {
        res.otherDateTextConditionHTMLList.forEach(item => {
          item['filterParams'] = ''
          item['type'] = ''
          let itemBegin = JSON.parse(item.beginTimeKey)
          itemBegin.colBizName = itemBegin.colBizName + '开始'
          itemBegin.type = 'from'
          this.otherDateTextConditionHTMLList.push({
            [itemBegin.colBizName]: item.beginTimeKey
          })
          this.optionParams.push(itemBegin)
          if (item.endTimeKey) {
            let itemEnd = JSON.parse(item.endTimeKey)
            itemEnd.colBizName = itemEnd.colBizName + '结束'
            itemEnd.type = 'to'
            this.otherDateTextConditionHTMLList.push({
              [itemEnd.colBizName]: item.endTimeKey
            })
            this.optionParams.push(itemEnd)
          }
        })
      }
      // 输入过滤条件
      this.textConditionHTMLList = res.textConditionHTMLList
      if (res.textConditionHTMLList.length) {
        res.textConditionHTMLList.forEach(item => {
          let key = Object.keys(item)
          let citem = JSON.parse(item[key])
          citem.conditionType === 12
            ? (citem['filterParams'] = [])
            : (citem['filterParams'] = '')
          citem['type'] = ''
          this.optionParams.push(citem)
        })
      }
      //  排序
      this.orderParams = res.orderHTMLList
      this.orderParams.forEach(element => {
        if (element.colOrderFlag) {
          this.sortField[element.colName] =
            element.colOrderFlag === 1 ? 'ascending' : 'descending'
        }
      })

      // 维度
      this.dimParams = res.dimHTMLList
      this.indexParams = res.kpiHTMLList
      this.dimParams.forEach(element => {
        if (element.dimDisabled == 2) {
          this.checkedDim.push(element.colName)
        }
        this.handleCheckedDimChange(this.checkedDim)
      })
      // 指标
      this.indexParams.forEach(element => {
        this.checkedFields.push(element.colName)
      })
      this.handleCheckedFieldChange(this.checkedFields)
      // 统计日期
      this.dateTextConditionHTMLList = res.dateTextConditionHTMLList
      this.dataSearchForm = []
      this.dateOptionConditioHTMLList = res.dateOptionConditioHTMLList
      if (res.dateTextConditionHTMLList.length) {
        res.dateTextConditionHTMLList.forEach(item => {
          let beginTimeKeyData = JSON.parse(item.beginTimeKey)
          this.dataSearchForm.push({
            beginTimeValue: item.beginTimeValue,
            endTimeValue: item.endTimeValue ? item.endTimeValue : '',
            beginTimeKey: item.beginTimeKey,
            endTimeKey: item.endTimeKey ? item.endTimeKey : '',
            colBizName: beginTimeKeyData.colBizName,
            conditionType: beginTimeKeyData.conditionType
          })
        })
        this.dateParamVisible = true
      } else {
        this.dateParamVisible = false
      }
      // 下拉年月日期条件
      if (res.dateOptionConditioHTMLList.length) {
        this.searchForm.yearDateValue =
          res.dateOptionConditioHTMLList[0].yearDateValue
        this.searchForm.monthDateValue =
          res.dateOptionConditioHTMLList[0].monthDateValue
        this.searchForm.colBizName = JSON.parse(
          res.dateOptionConditioHTMLList[0].yearDateKey
        ).colBizName
        this.dateOptionVisible = true
      } else {
        this.dateOptionVisible = false
      }
      this.loading = false
      // 获取表数据
      this.onSearch()
    },
    handleInputString(value) {},
    handleSizeChange(val: number) {
      this.pageSize = val
      this.onSearch()
    },
    handleCurrentChange(val: number) {
      this.page = val
      this.onSearch()
    },
    // 查询
    onSearch() {
      let params = this.getSearchData()
      this.getTableData(params)
    },
    // 下载报表
    downLoad() {
      let params = this.getSearchData()
      ElMessageBox.confirm(`确定下载报表操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.downLoadTableData(params)
        })
        .catch(() => {})
    },
    onSortChange({ order, prop }) {
      this.sortField[prop] = order
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
      this.handleCheckAllChange(value)
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
    },
    // 多个查询条件输入时重置数据
    inputTagChange(value, index, colName) {
      if (this.optionParams[index].colName === colName) {
        this.optionParams[index].filterParams = value
      }
    },
    flexColumnWidth(str) {
      // 以下分配的单位长度可根据实际需求进行调整
      this.getTextWidth(str)
      let flexWidth = 0
      for (const char of str) {
        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
          // 如果是英文字符，为字符分配8个单位宽度
          if (str.length < 10) {
            flexWidth = this.getTextWidth(str) + 35
          } else {
            flexWidth = this.getTextWidth(str) + 24
          }
        } else if (char >= '\u4e00' && char <= '\u9fa5') {
          // 如果是中文字符，为字符分配15个单位宽度
          if (str.length < 8) {
            flexWidth = this.getTextWidth(str) + 35
          } else {
            flexWidth = this.getTextWidth(str) + 24
          }
        } else {
          // 其他种类字符，为字符分配8个单位宽度
          if (str.length < 15) {
            flexWidth = this.getTextWidth(str) + 35
          } else {
            flexWidth = this.getTextWidth(str) + 24
          }
        }
      }
      return flexWidth + 'px'
    },
    getTextWidth(str, fontSize) {
      let result = 0
      let ele = document.createElement('div')
      ele.style.position = 'absolute'
      ele.style.whiteSpace = 'nowrap'
      ele.style.fontSize = fontSize
      ele.style.opacity = 0
      ele.innerText = str
      document.body.append(ele)
      result = ele.getBoundingClientRect().width
      document.body.removeChild(ele)
      return result
    }
  }
})
</script>

<style lang="scss">
.table-data {
  font-size: 8px;
  overflow: hidden;
}
.pagination {
  text-align: right;
  margin-top: 10px;
  background-color: #fff;
  display: flex;
  justify-content: end;
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
  width: 120px !important;
}
.demo-date-select {
  width: 100px !important;
}
.option-form-date {
  width: 260px !important;
}
.el-table .el-table__cell {
  padding: 0;
}
.demo-form-inline {
  background-color: #fff;
  height: 42px;
  padding-left: 5px;
  margin-bottom: 10px;
  padding-top: 10px;
  display: flex;
  align-items: center;
}
.elform-inline {
  display: inline;
}
// .el-table .cell.el-tooltip {
//   // width: 100% !important;
// }
.el-table__header,
.el-table__body,
.el-table__footer {
  width: 100% !important;
  table-layout: fixed !important;
  .cell.el-tooltip {
    width: auto !important;
  }
}

.date-form-item {
  margin-right: 15px !important;
}
.el-table.el-table-fixed-column--left.is-last-column.el-table__cell {
  left: 0 !important;
}
.el_popover_class {
  max-height: 500px !important;
  overflow-y: auto !important;
}
// 这个是我不想要滚动条,去掉滚动条的css代码,你们要的话可以不写
.el_popover_class::-webkit-scrollbar {
  display: none !important;
}
.el-scrollbar__bar.is-horizontal {
  height: 8px !important;
}
</style>
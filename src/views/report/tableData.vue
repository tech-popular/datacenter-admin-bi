<template>
  <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
    <el-form-item label="日期：" v-if="!!dateParam">
      <el-date-picker v-model="searchForm.qt" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYYMMDD"></el-date-picker>
    </el-form-item>
    <el-form-item label="日期：" v-if="!!dateParam">
      <el-date-picker v-model="searchForm.qt" type="date" placeholder="选择日期" value-format="YYYYMMDD"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-popover placement="right" width="400px" trigger="click">
        <template #reference>
          <el-button type="info" plain>过滤条件</el-button>
        </template>
        <el-row justify="left">
          <el-col :span="12">
            <span>请选择过滤条件</span>
          </el-col>
        </el-row>
        <el-checkbox-group v-model="searchForm.option">
          <div v-for="item in OptionParams" :key="item.tabID" class="groupclass">
            <el-checkbox :label="item.colName">{{ item.colBizName }}</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-popover>
    </el-form-item>
    <el-form-item>
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
        <el-checkbox-group v-model="checkedorders" @change="handleCheckedOrderChange">
          <div v-for="(order, index) in orderParams" :key="index" v-dragging="{ list: orderParams, item: order, group: 'orderParams' }" class="tab">
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
import { defineComponent, ref } from 'vue'
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

export default defineComponent({
  name: 'TableData',
  data() {
    return {
      pagination: {
        page: 1,
        pageSize: 10,
        total: 200
      },
      searchForm: {
        qt: '',
        dim: [],
        option: []
      },
      sortField: {}, // 记录排序的字段
      // 指标
      checkedFields: [], // 选中的指标
      checkFieldAll: false, // 全选状态
      isFieldIndeterminate: false, // 全选状态
      // 维度
      checkedDim: [], // 选中的维度
      checkDimAll: false, // 全选状态
      isDimIndeterminate: false, // 全选状态
      tabNum: 1
    }
  },
  setup() {
    const route: RouteLocationNormalized = useRoute()
    const modelId: string = String(route.params.modelId)

    const columnDatas: any = ref([]) // 记录表头数据
    const dateParam = ref('') // 记录日期字段
    const OptionParams: any = ref([]) // 记录过滤条件数据
    const dimParams: any = ref([]) // 记录维度数据
    const indexParams: any = ref([]) // 记录指标数据
    const orderParams: any = ref([]) // 记录排序指标
    const checkedorders: any = ref([]) // 排序勾选值
    const getColumns = async () => {
      const res: IResponse = await getAnalysisModelColumn(modelId)
      console.log('res:报表 ', res)
      console.log('res:DimHTMLList  ', res.dimHTMLList)
      console.log('res:KpiHTMLList  ', res.kpiHTMLList)
      console.log('res:OrderHTMLList  ', res.orderHTMLList)
      console.log('res:headRows  ', res.headRows)
      columnDatas.value = res.headRows
      OptionParams.value = res.optionHTMLList
      orderParams.value = res.orderHTMLList
      // this.checkedorders = []
      orderParams.value.forEach(element => {
        if (element.colOrderFlag) {
          checkedorders.value.push(element.colName)
        }
      })
      // columnDatas.value.map(item => {
      //   item.sortable = 'custom'
      // })

      // let dateItem = res.theadList.filter(item => {
      //   return item.dataType === 'date'
      // })
      // dateParam.value = dateItem[0]['name']

      dimParams.value = res.dimHTMLList

      indexParams.value = res.kpiHTMLList
    }

    const tableData: any = ref([])
    const getTableData = async (params: IModelSearch) => {
      // const res: IResponse = await getReportSearchData(params)
      // tableData.value = res.data
    }

    return {
      modelId,
      columnDatas,
      tableData,
      getColumns,
      getTableData,
      dateParam,
      dimParams,
      OptionParams,
      indexParams,
      orderParams,
      checkedorders,
      order0,
      order1,
      order2
    }
  },
  mounted() {
    // 获取表头数据
    // this.getColumns({
    //   // model_id: this.modelId
    // })
    this.getColumns()
    // 获取表数据
    this.searchData()
    this.$dragging.$on('dragged', ({ value }) => {
      console.log(value.item)
      console.log(value.list)
    })
    this.$dragging.$on('dragend', () => {})
  },
  methods: {
    // 搜索数据
    searchData() {
      let params: IModelSearch = {
        model_id: this.modelId,
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        ascColumn: '',
        descColumn: '',
        groupColumn: ''
      }

      if (!!this.dateParam && !!this.searchForm.qt) {
        params.dataList = [
          {
            dataColumn: this.dateParam,
            startTime: this.searchForm.qt[0],
            endTime: this.searchForm.qt[1]
          }
        ]
      }

      if (this.searchForm.dim.length > 0) {
        params.dimList = this.searchForm.dim
      }

      this.getTableData(params)
    },
    handleSizeChange(val: number) {
      this.pagination.pageSize = val

      this.searchData()
    },
    handleCurrentChange(val: number) {
      this.pagination.page = val

      this.searchData()
    },
    onSearch() {
      console.log(this.searchForm.qt)
      console.log(this.searchForm.dim)

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
      this.checkedFields = value ? this.indexParams : []
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
      this.checkedDim = value ? this.dimParams : []
      this.isDimIndeterminate = false
      console.log(this.checkedDim, '维度')
    },
    handleCheckedOrderChange(value: string[]) {
      // this.checkedorders
      console.log('this.checkedorders: ', this.checkedorders)
      const checkedCount = value.length
      // this.checkDimAll = checkedCount === this.dimParams.length
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
.tab {
  list-style: none;
  float: left;
  width: 100px;
  cursor: default;
  margin: 0;
  margin-right: 4px;
  height: 32px;
  padding: 5px 12px 4px;
  border: 1px solid #dcdee2;
  border-bottom: 0;
  border-radius: 0 0 0 0;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  background: #fff;
}
.tab:hover {
  color: #57a3f3;
}
.tabActive {
  padding-bottom: 5px;
  background: #fff;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  border-color: #dcdee2;
  color: #294bff;
}
</style>
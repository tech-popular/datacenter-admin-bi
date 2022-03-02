<template>
  <el-form :inline="false" :model="searchForm" class="demo-form-inline" size="small">
    <el-form-item label="日期：" v-if="!!dateParam">
      <el-date-picker v-model="searchForm.qt" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYYMMDD"></el-date-picker>
    </el-form-item>
    <el-form-item label="日期：" v-if="!!dateParam">
      <el-date-picker v-model="searchForm.qt" type="date" placeholder="选择日期" value-format="YYYYMMDD"></el-date-picker>
    </el-form-item>
    <el-form-item label="维度：" prop="dim">
      <el-checkbox-group v-model="searchForm.dim">
        <template v-for="item in dimParams" :key="item.name">
          <el-checkbox :label="item.name">{{ item.bizName }}</el-checkbox>
        </template>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="onSearch">查询</el-button>
      <el-popover placement="right" trigger="click">
        <template #reference>
          <el-button type="info" plain>指标</el-button>
        </template>
        <el-row justify="center">
          <el-col :span="12">
            <span>请选择指标</span>
          </el-col>
          <el-col :span="12">
            <el-checkbox v-model="checkFieldAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          </el-col>
        </el-row>
        <el-checkbox-group v-model="checkedFields" @change="handleCheckedFieldChange">
          <div v-for="field in indexParams" :key="field.name">
            <el-checkbox :label="field.name">{{field.bizName}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-popover>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" fit border stripe :header-cell-class-name="handleHeadAddClass" @sort-change="onSortChange" size="small">
    <template v-for="column in columnDatas" :key="column.name">
      <el-table-column :prop="column.name" :label="column.bizName" :sortable="column.sortable" />
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
        dim: []
      },
      sortField: {}, // 记录排序的字段
      checkedFields: [], // 选中的指标
      checkFieldAll: false, // 全选状态
      isIndeterminate: false // 全选状态
    }
  },
  setup() {
    const route: RouteLocationNormalized = useRoute()
    const modelId: string = String(route.params.modelId)

    const columnDatas: any = ref([]) // 记录表头数据
    const dateParam = ref('') // 记录日期字段
    const dimParams: any = ref([]) // 记录维度数据
    const indexParams: any = ref([]) // 记录指标数据
    const getColumns = async () => {
      const res: IResponse = await getAnalysisModelColumn(modelId)
      console.log('res: ', res)
      // columnDatas.value = res.theadList

      // columnDatas.value.map(item => {
      //   item.sortable = 'custom'
      // })

      // let dateItem = res.theadList.filter(item => {
      //   return item.dataType === 'date'
      // })
      // dateParam.value = dateItem[0]['name']

      // dimParams.value = res.dimList

      // indexParams.value = res.theadList
    }

    const tableData: any = ref([])
    const getTableData = async (params: IModelSearch) => {
      const res: IResponse = await getReportSearchData(params)
      tableData.value = res.data
    }

    return {
      modelId,
      columnDatas,
      tableData,
      getColumns,
      getTableData,
      dateParam,
      dimParams,
      indexParams
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
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.indexParams.length
      console.log(this.checkedFields)
    },
    handleCheckAllChange(value: boolean) {
      this.checkedFields = value ? this.indexParams : []
      this.isIndeterminate = false
      console.log(this.checkedFields)
    }
  }
})
</script>

<style lang="scss">
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
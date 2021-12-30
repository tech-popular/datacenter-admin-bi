<template>
  <el-form
    :inline="true"
    :model="searchForm"
    class="demo-form-inline"
    size="small">
    <el-form-item label="日期">
      <el-date-picker
        v-model="searchForm.qt"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table
    :data="tableData"
    border
    stripe
    size="small">
    <template v-for="column in columnDatas" :key="column.name">
        <el-table-column :prop="column.name" :label="column.bizName" />
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
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute, RouteLocationNormalized } from "vue-router";
import { getReportColumns, getReportSearchData } from "@/api/api";
import { IModelColumn, IResponse, IModelSearch } from "@/api/type";

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
                qt: ''
            }
        }
    },
    setup() {
        const route: RouteLocationNormalized = useRoute();
        const modelId: string = String(route.params.modelId);
        
        const columnDatas: any = ref([]);
        const getColumns = async (params: IModelColumn) => {
            const res: IResponse = await getReportColumns(params);
            columnDatas.value = res.data;
        };

        const tableData: any = ref([]);
        const getTableData = async (params: IModelSearch) => {
            const res: IResponse = await getReportSearchData(params);
            tableData.value = res.data;
        };

        return {
            modelId,
            columnDatas,
            tableData,
            getColumns,
            getTableData
        };
    },
    mounted() {
        // 获取表头数据
        this.getColumns({
            model_id: this.modelId
        });

        // 获取表数据
        this.searchData();
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
                pt: '',
                groupColumn: ''
            };

            this.getTableData(params);
        },
        handleSizeChange(val: number) {
            this.pagination.pageSize = val;

            this.searchData();
        },
        handleCurrentChange(val: number) {
            this.pagination.page = val;

            this.searchData();
        },
        onSearch() {

        }
    }
});
</script>

<style lang="scss">
.pagination {
    text-align: right;
    margin-top: 10px;
}
</style>
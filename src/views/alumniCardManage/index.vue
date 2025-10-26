<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="校友通行证申请列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->

      <template #operation="{ row }">
        <el-button
        v-if="row.status===0"
          type="primary"
          link
          :icon="Check"
          @click="openApplyForm('通行证审批', row)"
        >
          审批
        </el-button>
      </template>
    </ProTable>
    <ApplyForm ref="roleFormRef" />
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { getAlumniCardList, alumniCardApply } from '@/api/modules/alumniCard';
import ApplyForm from '@/views/alumniCardManage/components/applyForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';
import { formatDate } from '@/utils/index';

defineOptions({
  name: 'alumniCardManage'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { prop: 'name', label: '申请人姓名' },
  { prop: 'phone', label: '手机号' },
  { prop: 'expectedTime', label: '返校时间', render: (scope) => h('span', formatDate(scope.row.expectedTime)) },
  { prop: 'otherReason', label: '详细描述' },
  { prop: 'status', tag: true, label: '审批状态',
    enum: [
      { value: 0, label: '待审核', type: 'danger' },
      { value: 1, label: '已批准', type: 'success' },
      { value: 2, label: '已拒绝', type: 'error' }
    ]
   },
  { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
];
// 表格配置项
const searchColumns: SearchProps[] = [
  
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getAlumniCardList(params);

const roleFormRef = ref<any>();
const openApplyForm = (title: string, row = {}) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    api: alumniCardApply,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};
</script>

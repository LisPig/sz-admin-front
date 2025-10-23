<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="认证申请列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->

      <template #operation="{ row }">
        <el-button
        v-if="row.status==='1'"
          type="primary"
          link
          :icon="Check"
          @click="openAuthForm('认证审批', row)"
        >
          审批
        </el-button>
      </template>
    </ProTable>
    <AuthForm ref="roleFormRef" />
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { getAuthList, authApply } from '@/api/modules/auth';
import AuthForm from '@/views/authManage/components/authForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';

defineOptions({
  name: 'authManage'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { prop: 'phone', label: '申请人手机号' },
  { prop: 'name', label: '申请人姓名' },
  { prop: 'idCard', label: '申请人身份证' },
  { prop: 'identity', label: '申请人身份',
    enum: [
      { value: 1, label: '校友' },
      { value: 2, label: '教师' },
    ]
  },
  { prop: 'status', tag: true, label: '审批状态',
    enum: [
      { value: '1', label: '待审批', type: 'danger' },
      { value: '2', label: '通过', type: 'success' },
      { value: '3', label: '未通过', type: 'error' }
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
const getTableList = (params: any) => getAuthList(params);

const roleFormRef = ref<any>();
const openAuthForm = (title: string, row = {}) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    api: authApply,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};
</script>

<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="校友会列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->

      <template #operation="{ row }">
        <el-button
        v-if="row.status===''"
          type="primary"
          link
          :icon="Check"
          @click="openAuthForm('校友会申请审批', row)"
        >
          审批
        </el-button>
      </template>
    </ProTable>
    <Forms ref="roleFormRef" />
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { getAlumniAssociationList, editAlumniAssociation } from '@/api/modules/alumniAssociation';
import Forms from '@/views/alumniAssociationManage/components/Forms.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';

defineOptions({
  name: 'alumniAssociationManage'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { 
    prop: 'avatar', 
    label: '校友会头像',
    align: 'center',
    render: (scope) => {
      return scope.row.avatar 
        ? h('div', { style: { width: '50px', height: '50px', margin: '0 auto' } }, [
            h('img', {
              src: scope.row.avatar,
              style: { width: '100%', height: '100%', objectFit: 'cover' },
            })
          ])
        : h('span', '');
    }
  },
  { prop: 'name', label: '校友会名称' },
  { prop: 'contract', label: '联系人' },
  { prop: 'phone', label: '联系方式' },
  { prop: 'status', tag: true, label: '状态',
    enum: [
      { value: '1', label: '正常', tagType: 'success' },
      { value: '2', label: '禁用', tagType: 'danger' },
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
const getTableList = (params: any) => getAlumniAssociationList(params);

const roleFormRef = ref<any>();
const openAuthForm = (title: string, row = {}) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    api: editAlumniAssociation,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};
</script>

<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="校友会活动列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
       <template #tableHeader="scope">
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>

      <template #operation="{ row }">
        <el-button
        v-if="row.status===''||row.status==='0'"
          type="primary"
          link
          :icon="Check"
          @click="openAuthForm('活动申请审批', row)"
        >
          审批
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <Forms ref="roleFormRef" />
  </div>
</template>

<script setup lang="ts">
import { Check, Delete } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { getAlumniActivityList, applyAlumniActivity, deleteAlumniActivity } from '@/api/modules/alumniAssociationActivity';
import Forms from '@/views/alumniAssociationActivity/components/Forms.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';
import { useHandleData } from '@/hooks/useHandleData';

defineOptions({
  name: 'alumniAssociationActivity'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { 
    prop: 'avatar', 
    label: '活动主图',
    align: 'center',
    width: 100,
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
  { prop: 'title', label: '活动名称' },
  { prop: 'time', label: '活动时间' },
  { prop: 'status', tag: true, label: '状态', width: 100,
    enum: [
      { value: '0', label: '待审批', tagType: 'info' },
      { value: '1', label: '正常', tagType: 'success' },
      { value: '2', label: '禁用', tagType: 'danger' },
    ]
   },
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' }
];
// 表格配置项
const searchColumns: SearchProps[] = [
  { prop: 'title', label: '活动标题', el: 'input', props: {placeholder: '请输入'} },
 {
    prop: 'status',
    label: '状态',
    enum: [
      { value: '0', label: '待审核', type: 'info' },
      { value: '1', label: '通过', type: 'success' },
      { value: '2', label: '禁用', type: 'danger' }
    ],
    el: 'select',
    props: {
      placeholder: '请选择状态'
    }
  }
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getAlumniActivityList(params);

const roleFormRef = ref<any>();
const openAuthForm = (title: string, row = {}) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    api: applyAlumniActivity,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};

// 删除信息
const deleteInfo = async (params: any) => {
  await useHandleData(deleteAlumniActivity, { ids: [params.id] }, `删除该活动`);
  proTableRef.value?.getTableList();
};

// 批量删除
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(deleteAlumniActivity, { ids }, '删除所选活动');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
</script>

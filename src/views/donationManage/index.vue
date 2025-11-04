<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="捐赠项目列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openEditForm('新增捐赠项目')">
          新增捐赠项目
        </el-button>
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
          type="primary"
          link
          :icon="EditPen"
          @click="openEditForm('编辑捐赠项目', row, false)"
        >
          编辑
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <EditForm ref="roleFormRef" />
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Delete, EditPen } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { useHandleData } from '@/hooks/useHandleData';
import { getDonaProjectList, addDonaProject, editDonaProject, deleteDonaProject } from '@/api/modules/donation';
import EditForm from '@/views/donationManage/components/editForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';

defineOptions({
  name: 'donationManage'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { prop: 'name', label: '项目名称' },
  { prop: 'description', label: '描述' },
  { prop: 'amount', label: '筹措金额' },
  { prop: 'startTime', label: '开始时间' },
  { prop: 'endTime', label: '结束时间' },
  // { prop: 'status', tag: true, label: '项目状态',
  //   enum: [
  //     { value: '1', label: '待审批', type: 'danger' },
  //     { value: '2', label: '通过', type: 'success' },
  //     { value: '3', label: '未通过', type: 'error' }
  //   ]
  //  },
  { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
];
// 表格配置项
const searchColumns: SearchProps[] = [
  
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getDonaProjectList(params);

const roleFormRef = ref<any>();
const openEditForm = (title: string, row = {}, isAdd = true) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    api: isAdd ? addDonaProject : editDonaProject,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};

// 删除信息
const deleteInfo = async (params: any) => {
  await useHandleData(deleteDonaProject, { ids: [params.id] }, `删除该条数据`);
  proTableRef.value?.getTableList();
};

// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(deleteDonaProject, { ids }, '删除所选数据');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
</script>

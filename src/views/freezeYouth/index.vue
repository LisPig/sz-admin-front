<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="定格青春列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openBannerForm('新增')">
          新增
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
          @click="openBannerForm('编辑', row, false)"
        >
          编辑
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
import { CirclePlus, Delete, EditPen } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { useHandleData } from '@/hooks/useHandleData';
import { getSchoolClassMemoryList, addSchoolClassMemory, editSchoolClassMemory, deleteSchoolClassMemory } from '@/api/modules/freezeYouth';
import Forms from '@/views/freezeYouth/components/Forms.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';

defineOptions({
  name: 'freezeYouth'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { 
    prop: 'cover', 
    label: '主图',
    width: 100,
    align: 'center',
    render: (scope) => {
      return scope.row.cover 
        ? h('div', { style: { width: '60px', height: '60px', margin: '0 auto' } }, [
            h('img', {
              src: scope.row.cover,
              style: { width: '100%', height: '100%', },
            })
          ])
        : h('span', '暂无图片');
    }
  },
  { prop: 'year', label: '届数' },
  { prop: 'classNo', label: '班级' },
  { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
];
// 表格配置项
const searchColumns: SearchProps[] = [
  
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getSchoolClassMemoryList(params);

const roleFormRef = ref<any>();
const openBannerForm = (title: string, row = {}, isAdd = true) => {
  const params: View.DefaultParams = {
    title,
    row: {
      cover: '',
      year: '',
      classNo: '',
      teacherList: '',
      studentList: '',
      images: "",
      ...row
    },
    api: isAdd ? addSchoolClassMemory : editSchoolClassMemory,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};

// 删除信息
const deleteInfo = async (params: any) => {
  await useHandleData(deleteSchoolClassMemory, { ids: [params.id] }, `删除该条数据`);
  proTableRef.value?.getTableList();
};

// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(deleteSchoolClassMemory, { ids }, '删除所选数据');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
</script>

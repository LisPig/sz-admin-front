<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="校园风采列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openCampusForm('新增校园风采')">
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

      <template #title="{ row }">
        <el-button type="primary" link @click="openCampusData(row)">
          {{ row?.title }}
        </el-button>
      </template>

      <template #operation="{ row }">
        <el-button
          type="primary"
          link
          :icon="EditPen"
          @click="openCampusForm('编辑校园风采', row, false)"
        >
          编辑
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <CampusForm ref="roleFormRef" />
    <campusData ref="campusDataRef" />
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Delete, EditPen } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { useHandleData } from '@/hooks/useHandleData';
import { getCampusList, addCampus, editCampus, deleteCampus } from '@/api/modules/campus';
import CampusForm from '@/views/campusManage/components/campusForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';
import campusData from '@/views/campusManage/components/campusData.vue';

defineOptions({
  name: 'campusManage'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { prop: 'title', label: '标题' },
  { 
    prop: 'cover', 
    label: '封面图',
    align: 'center',
    render: (scope) => {
      return scope.row.cover 
        ? h('div', { style: { width: '100px', height: '60px', margin: '0 auto' } }, [
            h('img', {
              src: scope.row.cover,
              style: { width: '100%', height: '100%', objectFit: 'cover' },
            })
          ])
        : h('span', '暂无图片');
    }
  },
  { prop: 'category', label: '分类',
    enum: [
      { value: '1', label: '今日钱高' },
      { value: '2', label: '钱高历史' },
    ]
   },
  { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
];
// 表格配置项
const searchColumns: SearchProps[] = [
  { prop: 'title', label: '标题', el: 'input', props: {placeholder: '请填写标题'} },
  { 
    prop: 'category', 
    label: '分类', 
    el: 'select',
    enum: [
      { value: '1', label: '今日钱高' },
      { value: '2', label: '钱高历史' },
    ],
    props: {
      clearable: true,
      placeholder: '请选择分类'
    }
  }
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getCampusList(params);

const roleFormRef = ref<any>();
const openCampusForm = (title: string, row = {}, isAdd = true) => {
  const params: View.DefaultParams = {
    title,
    row: isAdd ? { category: '1' } : { ...row },
    api: isAdd ? addCampus : editCampus,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};

// 删除信息
const deleteInfo = async (params: any) => {
  await useHandleData(deleteCampus, { ids: [params.id] }, `删除该条数据`);
  proTableRef.value?.getTableList();
};

// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(deleteCampus, { ids }, '删除所选数据');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};

const campusDataRef = ref<any>();
const openCampusData = (row: any) => {
  campusDataRef.value?.show(row);
};
</script>

<template>
  <div class="dialog-table-box">
    <el-dialog
      v-model="visible"
      :title="`标题: ${info?.title}`"
      width="90%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      append-to-body
    >
      <ProTable
        ref="proTableRef"
        title="校园风采子图列表"
        :indent="20"
        :columns="columns"
        :search-columns="searchColumns"
        :request-api="getTableList"
        :init-param="initParam"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button
            type="primary"
            :icon="CirclePlus"
            @click="openAddEdit('新增子图', { albumId: info?.id, category: info?.category }, true)"
          >
            新增
          </el-button>
          <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
            批量删除
          </el-button>
        </template>

        <template #operation="{ row }">
          <el-button
            type="primary"
            link
            :disabled="row.isLock === 'T'"
            :icon="EditPen"
            @click="openAddEdit('编辑子图', row, false)"
          >
            编辑
          </el-button>
          <el-button type="primary" link :disabled="row.isLock === 'T'" :icon="Delete" @click="deleteInfo(row)"> 删除 </el-button>
        </template>
      </ProTable>
      <CampusForm ref="roleFormRef" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Delete, EditPen } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { addCampusChild, deleteCampusChild, editCampusChild, getCampusChildList } from '@/api/modules/campus';
import CampusForm from '@/views/campusManage/components/campusForm.vue';
import { useHandleData } from '@/hooks/useHandleData';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { reactive, ref, h } from 'vue';

defineOptions({
  name: 'campusData'
});

const visible = ref(false);
const info = ref<any>();

// 接收父组件传过来的参数
const show = (params: any) => {
  initParam.albumId = params.id as number;
  info.value = params;
  visible.value = true;
};

defineExpose({
  show
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
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' }
];

const searchColumns: SearchProps[] = [{ prop: 'title', label: '标题', el: 'input' }];

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ albumId: 0 });

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getCampusChildList(params);

// 打开 drawer(新增、查看、编辑)
const roleFormRef = ref<InstanceType<typeof CampusForm>>();
const openAddEdit = (title: string, row = {}, isAdd = true) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    api: isAdd ? addCampusChild : editCampusChild,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};

// 删除
const deleteInfo = async (params: any) => {
  await useHandleData(deleteCampusChild, { ids: [params.id] }, `删除该条数据`);
  proTableRef.value?.getTableList();
};

// 批量删除
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(deleteCampusChild, { ids }, '删除所选数据');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
</script>

<style scoped lang="scss"></style>

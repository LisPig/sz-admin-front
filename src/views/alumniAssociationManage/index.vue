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
          @click="openAuthForm('校友会申请审批', row)"
        >
          审批
        </el-button>
        <el-button 
          type="primary" 
          link 
          :icon="View" 
          @click="openDetail(row.id)"
        >
          查看
        </el-button>
        <el-button 
          type="primary" 
          link 
          :icon="Edit" 
          @click="openEditForm('编辑校友会', row)"
        >
          编辑
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <Forms ref="roleFormRef" />
    <Detail ref="detailRef" />
    <EditForm ref="editFormRef" />
  </div>
</template>

<script setup lang="ts">
import { Check, Delete, Edit, View } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { getAlumniAssociationList, editAlumniAssociation, deleteAlumniAssociation } from '@/api/modules/alumniAssociation';
import Forms from '@/views/alumniAssociationManage/components/Forms.vue';
import EditForm from '@/views/alumniAssociationManage/components/EditForm.vue'; // 新增编辑表单组件
import Detail from '@/views/alumniAssociationManage/components/Detail.vue'; // 详情组件
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';
import { useHandleData } from '@/hooks/useHandleData';

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
  { 
    prop: 'name', 
    label: '校友会名称',
    render: (scope) => {
      return h(
        'el-link', 
        {
          type: 'primary',
          underline: true,
          onClick: () => openDetail(scope.row.id)
        }, 
        { default: () => scope.row.name }
      );
    }
  },
  { prop: 'contract', label: '联系人', width: 150 },
  { prop: 'phone', label: '联系方式', width: 120 },
  { prop: 'status', tag: true, label: '状态', width: 100, 
    enum: [
      { value: '0', label: '待审批', tagType: 'info' },
      { value: '1', label: '正常', tagType: 'success' },
      { value: '2', label: '禁用', tagType: 'danger' },
    ]
   },
  { prop: 'operation', label: '操作', width: 220, fixed: 'right' }
];
// 表格配置项
const searchColumns: SearchProps[] = [
  
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getAlumniAssociationList(params);

const roleFormRef = ref<any>();
const editFormRef = ref<any>(); // 编辑表单组件引用
const detailRef = ref<any>(); // 详情组件引用

const openAuthForm = (title: string, row = {}) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    api: editAlumniAssociation,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};

// 打开编辑对话框
const openEditForm = (title: string, row = {}) => {
  const params: View.DefaultParams = {
    title,
    row: { ...row },
    isEdit: true,
    getTableList: proTableRef.value?.getTableList
  };
  editFormRef.value?.acceptParams(params);
};

// 打开详情对话框
const openDetail = (id: number) => {
  detailRef.value?.openDialog(id);
};

// 删除信息
const deleteInfo = async (params: any) => {
  await useHandleData(deleteAlumniAssociation, { ids: [params.id] }, `删除该校友会`);
  proTableRef.value?.getTableList();
};

// 批量删除
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(deleteAlumniAssociation, { ids }, '删除所选校友会');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
</script>
<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="文章列表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openBannerForm('新增文章')">
          新增文章
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除文章
        </el-button>
      </template>

      <template #operation="{ row }">
        <el-button
          type="primary"
          link
          :icon="EditPen"
          @click="openBannerForm('编辑文章', row, false)"
        >
          编辑
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <ArticleForm ref="roleFormRef" />
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Delete, EditPen, Lock } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { useHandleData } from '@/hooks/useHandleData';
import { getArticleList, addArticle, editArticle, deleteArticle } from '@/api/modules/article';
import ArticleForm from '@/views/articleManage/components/articleForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref } from 'vue';

defineOptions({
  name: 'articleManage'
});

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { prop: 'picture', label: '图片地址' },
  { prop: 'status', tag: true, label: '状态' },
  { prop: 'sort', label: '排序' },
];
// 表格配置项
const searchColumns: SearchProps[] = [
  
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTableRef = ref<ProTableInstance>();

// 获取table列表
const getTableList = (params: any) => getArticleList(params);

const roleFormRef = ref<any>();
const openBannerForm = (title: string, row = {}, isAdd = true) => {
  const params: View.DefaultParams = {
    title,
    row: isAdd ? { status: 1, sort: 0 } : { ...row },
    api: isAdd ? addArticle : editArticle,
    getTableList: proTableRef.value?.getTableList
  };
  roleFormRef.value?.acceptParams(params);
};

// 删除信息
const deleteInfo = async (params: any) => {
  await useHandleData(deleteArticle, { ids: [params.id] }, `删除该篇文章`);
  proTableRef.value?.getTableList();
};

// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(deleteArticle, { ids }, '删除所选文章');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
</script>

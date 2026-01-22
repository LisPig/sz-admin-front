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
          v-if="row.status==='0'"
          type="primary"
          link
          :icon="Finished"
          @click="openBannerForm('审核文章', row, false)"
        >
          审核
        </el-button>
        <el-button
          v-else
          type="primary"
          link
          :icon="View"
          @click="openBannerForm('查看文章', row, false)"
        >
          查看
        </el-button>
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
import { CirclePlus, Delete, EditPen, Finished, View } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { useHandleData } from '@/hooks/useHandleData';
import { getArticleList, addArticle, editArticle, deleteArticle } from '@/api/modules/article';
import ArticleForm from '@/views/articleManage/components/articleForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ref, h } from 'vue';
import { useDict } from '@/hooks/useDict';
import { useDictOptions } from '@/hooks/useDictOptions';

defineOptions({
  name: 'articleManage'
});

useDict(['article_type']);

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 80, selectable: row => row.isLock !== 'T' },
  { prop: 'id', label: '编号', width: 80 },
  { 
    prop: 'avatar', 
    label: '文章头图',
    align: 'center',
    render: (scope) => {
      return scope.row.avatar 
        ? h('div', { style: { width: '100px', height: '60px', margin: '0 auto' } }, [
            h('img', {
              src: scope.row.avatar,
              style: { width: '100%', height: '100%', objectFit: 'cover' },
            })
          ])
        : h('span', '暂无图片');
    }
  },
  { prop: 'title', label: '文章标题', width: 300 },
  {
    prop: 'type',
    label: '文章类型',
    enum: useDictOptions('article_type'),
    fieldNames: {
      label: 'codeName',
      value: 'id',
      tagType: 'callbackShowStyle'
    },
    width: 150
  },
  { prop: 'author', label: '文章作者', width: 120 },
  { prop: 'status', tag: true, label: '状态',
    enum: [
      { value: '0', label: '待审核', type: 'info' },
      { value: '1', label: '通过', type: 'success' },
      { value: '-1', label: '拒绝', type: 'danger' }
    ]
   },
  { prop: 'sort', label: '排序' },
  { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
];
// 表格配置项
const searchColumns: SearchProps[] = [
  {
    prop: 'type',
    label: '文章类型',
    enum: useDictOptions('article_type'), // 使用字典数据
    fieldNames: {
      label: 'codeName',
      value: 'id'
    },
    el: 'select',
    props: {
      placeholder: '请选择文章类型'
    }
  },
  {
    prop: 'status',
    label: '状态',
    enum: [
      { value: '0', label: '待审核', type: 'info' },
      { value: '1', label: '通过', type: 'success' },
      { value: '-1', label: '拒绝', type: 'danger' }
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
const getTableList = (params: any) => getArticleList(params);

const roleFormRef = ref<any>();
const openBannerForm = (title: string, row = {}, isAdd = true) => {
  const params: View.DefaultParams = {
    title,
    row: isAdd ? { sort: 0 } : { ...row },
    api: isAdd ? addArticle : editArticle,
    getTableList: proTableRef.value?.getTableList,
    isAdd: isAdd
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

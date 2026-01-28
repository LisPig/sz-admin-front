<template>
  <el-dialog v-model="dialogVisible" title="活动详情" width="60%" top="5vh" :before-close="closeDialog">
    <div v-if="detailData" class="activity-detail-container">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动名称">{{ detailData.title }}</el-descriptions-item>
        <el-descriptions-item label="所属校会">{{ detailData.alumniAssociationName }}</el-descriptions-item>
        <el-descriptions-item label="活动时间">{{ detailData.time }}</el-descriptions-item>
        <el-descriptions-item label="活动地点">{{ detailData.location }}</el-descriptions-item>
        <el-descriptions-item label="活动状态">
          <el-tag :type="getStatusTagType(detailData.status)">
            {{ getStatusText(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ detailData.joinNum }}人</el-descriptions-item>
        <el-descriptions-item label="活动主图" :span="2">
          <el-image
            v-if="detailData.avatar"
            :src="detailData.avatar"
            :preview-src-list="[detailData.avatar]"
            :initial-index="0"
            fit="cover"
            style="width: 200px; height: 150px; border-radius: 4px;"
            :preview-teleported="true"
          />
        </el-descriptions-item>
        <el-descriptions-item label="活动内容" :span="2">
          <div class="content-text">{{ detailData.content }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-else class="loading">
      <el-empty description="正在加载..." />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getAlumniActivityDetail } from '@/api/modules/alumniAssociationActivity';

interface ActivityDetail {
  id: number;
  alumniAssociationId: number;
  alumniAssociationName: string;
  title: string;
  avatar: string;
  content: string;
  time: string;
  location: string;
  status: string;
  isJoin: boolean;
  joinNum: number;
  startTime: string;
  endTime: string;
  createTime: string;
  updateTime: string;
  createId: number;
  updateId: number;
}

const dialogVisible = ref(false);
const detailData = ref<ActivityDetail | null>(null);

// 打开详情对话框
const openDialog = async (id: number) => {
  try {
    const response = await getAlumniActivityDetail(id);
    if(response && response.code === '0000') {
      detailData.value = response.data as ActivityDetail;
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.message || '获取详情失败');
    }
  } catch (error) {
    ElMessage.error('获取详情失败');
    console.error(error);
  }
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
  detailData.value = null;
};

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case '0':
      return 'info';
    case '1':
      return 'success';
    case '2':
      return 'danger';
    default:
      return 'info';
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case '0':
      return '待审批';
    case '1':
      return '正常';
    case '2':
      return '禁用';
    default:
      return '未知';
  }
};

// 暴露方法给父组件使用
defineExpose({
  openDialog
});
</script>

<style scoped>
.activity-detail-container {
  max-height: 70vh;
  overflow-y: auto;
}

.content-text {
  white-space: pre-wrap;
  line-height: 1.6;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>
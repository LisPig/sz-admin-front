<template>
  <el-dialog v-model="dialogVisible" title="校友会详情" width="80%" top="5vh" :before-close="closeDialog">
    <div v-if="detailData" class="alumni-detail-container">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="校友会名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ detailData.contract }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="校友会成员数">
          {{ detailData.number }}
          <el-tag type="success">共{{ detailData.memberList?.length || 0 }}名成员</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动数">
          {{ detailData.activityNumber }}
          <el-tag type="warning">共{{ detailData.activityList?.length || 0 }}个活动</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTagType(detailData.status)">
            {{ getStatusText(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ detailData.description }}
        </el-descriptions-item>
        <el-descriptions-item label="头像" :span="2">
          <el-image
            v-if="detailData.avatar"
            :src="detailData.avatar"
            :preview-src-list="[detailData.avatar]"
            :initial-index="0"
            fit="cover"
            style="width: 100px; height: 100px; border-radius: 4px;"
            :preview-teleported="true"
          />
        </el-descriptions-item>
      </el-descriptions>

      <div class="detail-content">
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <div class="activity-section">
              <h3>校友会活动</h3>
              <el-card
                v-for="activity in detailData.activityList"
                :key="activity.id"
                class="activity-item"
                shadow="hover"
              >
                <div class="activity-header">
                  <h4>{{ activity.title }}</h4>
                  <el-tag :type="getActivityStatusTagType(activity.status)">
                    {{ getActivityStatusText(activity.status) }}
                  </el-tag>
                </div>
                <div class="activity-info">
                  <p><strong>时间:</strong> {{ activity.time }}</p>
                  <p><strong>地点:</strong> {{ activity.location }}</p>
                  <p><strong>参与人数:</strong> {{ activity.joinNum }}</p>
                  <p><strong>内容:</strong> {{ activity.content }}</p>
                </div>
              </el-card>
              <div v-if="!detailData.activityList || detailData.activityList.length === 0" class="no-data">
                暂无活动数据
              </div>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="member-section">
              <h3>校友会成员</h3>
              <el-table :data="detailData.memberList" stripe style="width: 100%">
                <el-table-column prop="username" label="姓名" min-width="100" />
                <el-table-column prop="job" label="职务" min-width="100" />
                <el-table-column prop="workUnit" label="工作单位" min-width="120" />
                <el-table-column prop="phone" label="联系电话" min-width="120" />
                <el-table-column label="头像" width="80">
                  <template #default="{ row }">
                    <el-avatar size="small" :src="row.avatarUrl"></el-avatar>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="!detailData.memberList || detailData.memberList.length === 0" class="no-data">
                暂无成员数据
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
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
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getAlumniAssociationDetail } from '@/api/modules/alumniAssociation';

interface AlumniAssociationDetail {
  id: number;
  name: string;
  avatar: string;
  description: string;
  contract: string;
  phone: string;
  status: string;
  number: number;
  activityNumber: number;
  isMember: boolean;
  createTime: string;
  updateTime: string;
  activityList: Activity[];
  memberList: Member[];
}

interface Activity {
  id: number;
  alumniAssociationId: number;
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
}

interface Member {
  id: number;
  openid: string;
  unionid: string;
  username: string;
  avatarUrl: string;
  authStatus: number;
  isShow: number;
  workUnit: string;
  job: string;
  phone: string;
  honor: string;
  memory: string;
  mySuggestion: string;
  identity: string;
}

const dialogVisible = ref(false);
const detailData = ref<AlumniAssociationDetail | null>(null);

// 打开详情对话框
const openDialog = async (id: number) => {
  try {
    const response = await getAlumniAssociationDetail(id);
    if(response && response.code === '0000') {
      detailData.value = response.data as AlumniAssociationDetail;
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

// 获取活动状态标签类型
const getActivityStatusTagType = (status: string) => {
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

// 获取活动状态文本
const getActivityStatusText = (status: string) => {
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
.alumni-detail-container {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-content {
  margin-top: 20px;
}

.activity-section,
.member-section {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
}

.activity-section h3,
.member-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
}

.activity-item {
  margin-bottom: 10px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.activity-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>
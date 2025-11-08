<template>
  <el-dialog v-model="visible" :title="`${paramsProps.title}`" :destroy-on-close="true" width="580px" draggable append-to-body>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >

      <!-- 发布者 -->
       <el-form-item label="发布者" prop="username">
        <el-input v-model="paramsProps.row.username" :disabled="true"></el-input>
       </el-form-item>

      <!-- 头像上传 -->
      <el-form-item label="发布图片" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/sys-file/upload"
          :data="{'dirTag':'avatar'}"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
          :disabled="true"
        >
        <template v-if="paramsProps.row.imgList.length>0">
          <img v-for="item in paramsProps.row.imgList" :src="item" class="avatar" />
        </template>
          
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

       <!-- 发布内容 -->
       <el-form-item label="发布内容" prop="content">
        <el-input type="textarea" autosize v-model="paramsProps.row.content" :disabled="true"></el-input>
       </el-form-item>

       <!-- 关注数 -->
       <el-form-item label="关注数" prop="likeCount">
        <el-input v-model="paramsProps.row.likeCount" :disabled="true"></el-input>
       </el-form-item>

       <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item
            v-for="value in paramsProps.row.comments"
            :label="value.replyTo?`${value.username} 回复 @${value.replyTo}`:value.username"
            :label-width="150"
            label-align="right">
            {{value.content}}
          </el-descriptions-item>
       </el-descriptions>

    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 关闭 </el-button>
      <!-- <el-button type="primary" @click="handleSubmit"> 确定 </el-button> -->
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
const userStore = useUserStore();

defineOptions({
  name: 'editForm'
});

// 动态计算请求头
const uploadHeaders = computed(() => ({
  'Authorization': 'Bearer ' + userStore.token,  // 从缓存获取token
  'clientId': import.meta.env.VITE_APP_CLIENT_ID,     // 固定clientId
}));

const rules = ref({

});

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {
    imgList: [],
    username: '',
    content: '',
    likeCount: 0,
    comments: [],
  },
  api: undefined,
  getTableList: undefined
});

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  paramsProps.value = params;
  visible.value = true;
};

// 文件上传校验
const beforeUpload = (file:any) => {
  const isImage = file.type.includes('image/');
  const isLt2MB = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt2MB) {
    ElMessage.error('图片大小不能超过 5MB！');
    return false;
  }
  return true;
};

// 上传成功回调
const handleUploadSuccess = (response:any, file:any) => {
  paramsProps.value.row.avatar = response.data.url; // 假设接口返回 { data: { url: '...' } }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      await paramsProps.value.api!(paramsProps.value.row);
      ElMessage.success({ message: `${paramsProps.value.title}成功！` });
      paramsProps.value.getTableList!();
      visible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
:deep(.avatar-uploader) .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader) .el-upload:hover {
  border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar{
  width: 100px;
  height: 100px;
}
</style>

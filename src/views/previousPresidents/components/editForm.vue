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
      <!-- 头像上传 -->
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/sys-file/upload"
          :data="{'dirTag':'avatar'}"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="paramsProps.row.avatar" :src="paramsProps.row.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 姓名 -->
       <el-form-item label="姓名" prop="name">
        <el-input v-model="paramsProps.row.name"></el-input>
       </el-form-item>

      <!-- 任职开始时间 -->
       <el-form-item label="任职开始时间" prop="startTime">
        <el-input v-model="paramsProps.row.startTime"></el-input>
       </el-form-item>

       <!-- 任职结束时间 -->
       <el-form-item label="任职结束时间" prop="endTime">
        <el-input v-model="paramsProps.row.endTime"></el-input>
       </el-form-item>

       <!-- 职务 -->
       <el-form-item label="职务" prop="position">
        <el-input v-model="paramsProps.row.position"></el-input>
       </el-form-item>

       <!-- 描述 -->
       <el-form-item label="描述" prop="description">
        <el-input v-model="paramsProps.row.description"></el-input>
       </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
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
  avatar: [{ required: true, message: '请上传头像' }],
  name: [{ required: true, message: '请填写姓名' }],
  startTime: [{ required: true, message: '请填写任职开始时间' }],
  endTime: [{ required: true, message: '请填写任职结束时间' }],
  position: [{ required: true, message: '请填写职务' }],
});

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {
    avatar: '',
    name: '',
    startTime: '',
    endTime: '',
    position: '',
    description: '',
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
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar{
  width: 178px;
  height: 178px;
}
</style>

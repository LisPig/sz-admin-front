<template>
  <el-dialog v-model="visible" :title="`${paramsProps.title}`" :destroy-on-close="true" width="1200px" draggable append-to-body>
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <!-- 轮播图上传 -->
      <el-form-item label="文章头图" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/sys-file/upload"
          :data="{'dirTag':'article'}"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="paramsProps.row.avatar" :src="paramsProps.row.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 文章标题 -->
       <el-form-item label="文章标题" prop="title">
        <el-input v-model="paramsProps.row.title"></el-input>
       </el-form-item>

       <!-- 文章类型 -->
       <el-form-item label="文章类型" prop="type">
        <el-select v-model="paramsProps.row.type">
          <el-option v-for="item in articleType" :key="item.id" :label="item.codeName" :value="Number(item.id)" />
        </el-select>
       </el-form-item>

       <!-- 文章作者 -->
       <el-form-item label="文章作者" prop="author">
        <el-input v-model="paramsProps.row.author"></el-input>
       </el-form-item>

      <!-- 排序字段 -->
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="paramsProps.row.sort"
          :min="0"
          :max="100"
          controls-position="right"
        />
      </el-form-item>

      <!-- 文章内容 -->
       <el-form-item label="文章内容" prop="content">
        <WangEditor v-model="paramsProps.row.content" />
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
import WangEditor from '@/components/WangEditor/WangEditor.vue'; // 引入编辑器组件
const userStore = useUserStore();
import { useDictOptions } from '@/hooks/useDictOptions';

defineOptions({
  name: 'bannerForm'
});

const articleType = useDictOptions('article_type');

// 动态计算请求头
const uploadHeaders = computed(() => ({
  'Authorization': 'Bearer ' + userStore.token,  // 从缓存获取token
  'clientId': import.meta.env.VITE_APP_CLIENT_ID,     // 固定clientId
}));

const rules = ref({
  title: [{ required: true, message: '请填写文章标题' }],
  type: [{ required: true, message: '请选择文章类型' }]
});

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {
    picture: '',
    title: '',
    type: '',
    author: '',
    sort: 0,
    content: '',
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
  const isLt2MB = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt2MB) {
    ElMessage.error('图片大小不能超过 2MB！');
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

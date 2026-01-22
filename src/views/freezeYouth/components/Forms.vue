<template>
  <el-dialog v-model="visible" :title="`${paramsProps.title}`" :destroy-on-close="true" width="1280px" draggable append-to-body>
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <!-- 轮播图上传 -->
      <el-form-item label="定格青春主图" prop="cover">
        <el-upload
          class="avatar-uploader"
          action="/api/sys-file/upload"
          :data="{'dirTag':'zhutu'}"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="paramsProps.row.cover" :src="paramsProps.row.cover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="届数" prop="year">
        <el-date-picker
          v-model="paramsProps.row.year"
          value-format="YYYY"
          type="year"
        />
      </el-form-item>

      <el-form-item label="班级" prop="classNo">
        <el-input v-model="paramsProps.row.classNo"></el-input>
      </el-form-item>

      <el-form-item label="教师列表" prop="teacherList">
        <el-input type="textarea" v-model="paramsProps.row.teacherList"></el-input>
      </el-form-item>

      <el-form-item label="学生列表" prop="studentList">
        <el-input type="textarea" v-model="paramsProps.row.studentList"></el-input>
      </el-form-item>

      <el-form-item label="照片">
         <el-upload
          v-model:file-list="fileList"
          action="/api/sys-file/upload"
          :headers="uploadHeaders"
          :data="{'dirTag':'zhaopian'}"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess2"
          :before-upload="beforeUpload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" style="max-width: 100%; max-height: 80vh;"/>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
const userStore = useUserStore();

defineOptions({
  name: 'Forms'
});

// 动态计算请求头
const uploadHeaders = computed(() => ({
  'Authorization': 'Bearer ' + userStore.token,  // 从缓存获取token
  'clientId': import.meta.env.VITE_APP_CLIENT_ID,     // 固定clientId
}));

const rules = ref({
  year: [{ required: true, message: '请选择届数' }],
  classNo: [{ required: true, message: '请输入班级' }],
});

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {
    cover: '',
    year: '',
    classNo: '',
    teacherList: '',
    studentList: '',
    images: ""
  },
  api: undefined,
  getTableList: undefined
});

const fileList = ref([]);

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (uploadFile:any, uploadFiles:any) => {
  fileList.value = fileList.value.filter((item:any)=>{
    // 兼容初始化的文件（uid）和上传后的文件（id/uid）
    return item.uid !== uploadFile.uid && item.id !== uploadFile.id;
  });
}

const handlePictureCardPreview = (uploadFile:any) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  if(params.row.images===''){
    fileList.value = [];
  }else{
    fileList.value = params.row.images.split(',').map((url:any, index:any) => ({
      url: url, // 每个数组元素存入对象的url属性
      uid: index,
      name: url,
    }));
  }
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
  paramsProps.value.row.cover = response.data.url; // 假设接口返回 { data: { url: '...' } }
};

// 上传成功回调
const handleUploadSuccess2 = (response:any, file:any) => {
  const fileItem:any = fileList.value.find((item:any) => item.uid === file.uid);
  if (fileItem) {
    // 替换为服务器返回的正式url
    fileItem.url = response.data.url;
    // 补充fileId（方便后续删除等操作）
    fileItem.id = response.data.fileId;
    // 可选：补充文件名（提升体验）
    fileItem.name = file.name;
  }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref();
const handleSubmit = () => {
  let imgs = fileList.value.map((item:any)=>{
    return item.url
  })
  paramsProps.value.row.images = imgs.join();
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

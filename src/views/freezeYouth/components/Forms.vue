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
        <div class="student-table">
          <div 
            v-for="(row, rowIndex) in studentRows" 
            :key="rowIndex" 
            class="student-row"
          >
            <span class="row-label">{{ rowIndex + 1 }}排 |</span>
            <el-input
              v-model="row.students"
              class="student-input"
              placeholder="请输入学生姓名，用逗号分隔"
            />
            <el-button 
              type="danger" 
              link 
              @click="removeStudentRow(rowIndex)"
              class="remove-row-btn"
            >
              <el-icon><Minus /></el-icon>
            </el-button>
          </div>
          
          <el-button type="success" link @click="addStudentRow">
            <el-icon><Plus /></el-icon> 添加新排
          </el-button>
        </div>
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
import { ref, computed, nextTick, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Minus } from '@element-plus/icons-vue';
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

// 学生列表行数据，每行包含一个字符串，表示该排的学生列表
const studentRows = ref<Array<{ students: string }>>([
  { students: '' } // 初始化一行，包含一个空输入框
]);

// 监听参数变化，更新学生列表显示
watch(
  () => paramsProps.value.row.studentList,
  (newVal) => {
    if (newVal) {
      parseStudentList(newVal);
    } else {
      studentRows.value = [{ students: '' }];
    }
  },
  { immediate: true }
);

// 解析学生列表字符串为表格数据
const parseStudentList = (str: string) => {
  if (!str) {
    studentRows.value = [{ students: '' }];
    return;
  }

  try {
    // 尝试解析JSON格式的学生列表
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      studentRows.value = parsed.map(item => ({ students: item.students || item }));
    } else {
      // 如果不是JSON格式，尝试逗号分隔
      const rows = str.split(';');
      studentRows.value = rows.map(row => ({
        students: row || ''
      }));
    }
  } catch (e) {
    // 如果JSON解析失败，尝试旧格式
    const rows = str.split(';');
    studentRows.value = rows.map(row => ({
      students: row || ''
    }));
  }
};

// 添加新行
const addStudentRow = () => {
  studentRows.value.push({ students: '' });
};

// 删除指定行
const removeStudentRow = (rowIndex: number) => {
  if (studentRows.value.length > 1) {
    studentRows.value.splice(rowIndex, 1);
  } else {
    // 如果只有一行，清空内容而不是删除
    studentRows.value[0].students = '';
  }
};

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
  // 处理图片列表
  if(!params.row.images || params.row.images === ''){
    fileList.value = [];
  }else{
    fileList.value = params.row.images.split(',').map((url:any, index:any) => ({
      url: url, // 每个数组元素存入对象的url属性
      uid: index,
      name: url,
    }));
  }
  
  paramsProps.value = params;
  
  // 初始化学生列表
  if (params.row.studentList) {
    parseStudentList(params.row.studentList);
  } else {
    studentRows.value = [{ students: '' }];
  }
  
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
  // 将学生列表转换为字符串格式保存
  const studentListStr = studentRows.value
    .map(row => row.students.trim())
    .filter(rowStr => rowStr !== '')
    .join(';');
  
  paramsProps.value.row.studentList = studentListStr;
  
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

.student-table {
  width: 100%;
}

.student-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  
  .row-label {
    margin-right: 10px;
    min-width: 40px;
    text-align: left;
  }
  
  .student-input {
    width: calc(100% - 80px); /* 占满剩余空间 */
    margin-right: 10px;
    margin-bottom: 5px;
  }
  
  .remove-row-btn {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
<template>
  <el-dialog v-model="visible" top="5vh" :title="`${paramsProps.title}`" :destroy-on-close="true" width="1200px" draggable append-to-body>
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
          :disabled="disabled"
        >
          <img v-if="paramsProps.row.avatar" :src="paramsProps.row.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      
       <el-row>
        <el-col :span="6">
          <!-- 文章标题 -->
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="paramsProps.row.title" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 文章类型 -->
       <el-form-item label="文章类型" prop="type">
        <el-select v-model="paramsProps.row.type" :disabled="disabled">
          <el-option v-for="item in articleType" :key="item.id" :label="item.codeName" :value="String(item.id)" />
        </el-select>
       </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 文章作者 -->
       <el-form-item label="文章作者" prop="author">
        <el-input v-model="paramsProps.row.author" :disabled="disabled"></el-input>
       </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 排序字段 -->
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="paramsProps.row.sort"
          style="width: 100%;"
          :min="0"
          controls-position="right"
          :disabled="disabled"
        />
      </el-form-item>
        </el-col>
       </el-row>

      <!-- 内容类型 -->
       <el-form-item label="内容类型" prop="contentType">
        <el-radio-group v-model="paramsProps.row.contentType" :disabled="disabled">
          <el-radio value="html">富文本</el-radio>
          <el-radio value="link">外链</el-radio>
        </el-radio-group>
       </el-form-item>

      <!-- 文章内容 -->
       <el-form-item label="文章内容" prop="content" v-if="paramsProps.row.contentType==='html'">
        <WangEditor v-model="paramsProps.row.content" :disabled="disabled" />
       </el-form-item>
       <el-form-item label="外链地址" prop="content" v-else>
        <el-input v-model="paramsProps.row.content" :disabled="disabled"></el-input>
       </el-form-item>
    </el-form>
    <template #footer v-if="paramsProps.row.status==='0' && !paramsProps.title.includes('编辑')">
      <el-button type="danger" v-auth="'sys.article.apply_btn'" @click="handleApply('-1')"> 拒绝 </el-button>
      <el-button type="primary" v-auth="'sys.article.apply_btn'" @click="handleApply('1')"> 通过 </el-button>
    </template>
    <template #footer v-else-if="(paramsProps.row.status==='-1'||paramsProps.row.status==='1') && !paramsProps.title.includes('编辑')">
      <el-button @click="visible = false"> 取消 </el-button>
    </template>
    <template #footer v-else>
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
  type: [{ required: true, message: '请选择文章类型' }],
  contentType: [{ required: true, message: '请选择内容类型' }],
});

const disabled = computed(() => {
  // 如果是"查看文章"或"审核文章"操作，则根据状态判断是否禁用
  if (paramsProps.value.title.includes('查看') || paramsProps.value.title.includes('审核')) {
    return paramsProps.value.row.status === '0' || paramsProps.value.row.status === '-1' || paramsProps.value.row.status === '1';
  }
  
  // 如果是"编辑文章"操作，只有在文章被拒绝时才禁用编辑，已通过的文章允许编辑
  if (paramsProps.value.title.includes('编辑')) {
    return paramsProps.value.row.status === '-1'; // 只有拒绝状态(-1)才禁用编辑
  }
  
  // 新增操作不受限制
  return false;
})

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {
    picture: '',
    title: '',
    type: '',
    author: '',
    sort: 0,
    contentType: '',
    content: '',
  },
  api: undefined,
  getTableList: undefined,
  isAdd: false
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
      if(paramsProps.value.isAdd)paramsProps.value.row.status = '0';
      await paramsProps.value.api!(paramsProps.value.row);
      ElMessage.success({ message: `${paramsProps.value.title}成功！` });
      paramsProps.value.getTableList!();
      visible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

//审批
const handleApply = (status: any) => {
  ruleFormRef.value!.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      paramsProps.value.row.status = status;
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
  width: 478px;
  height: 178px;
  text-align: center;
}
.avatar{
  width: 478px;
  height: 178px;
}
</style>

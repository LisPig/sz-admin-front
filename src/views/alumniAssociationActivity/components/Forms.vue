<template>
  <el-dialog v-model="visible" :title="`${paramsProps.title}`" :destroy-on-close="true" width="1200px" draggable append-to-body>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <el-form-item label="活动主图" prop="avatar">
        <img :src="paramsProps.row.avatar" style="width: 60px;height: 60px;" />
      </el-form-item>

      <!-- 活动名称 -->
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="paramsProps.row.title" disabled></el-input>
      </el-form-item>

      <!-- 活动时间 -->
      <el-form-item label="活动时间" prop="time">
        <el-input v-model="paramsProps.row.time" disabled></el-input>
      </el-form-item>

      <!-- 活动内容 -->
      <el-form-item label="活动内容" prop="content">
        <WangEditor v-model="paramsProps.row.content" disabled />
       </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" @click="handleSubmit(2)"> 拒绝 </el-button>
      <el-button type="primary" @click="handleSubmit(1)"> 通过 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import WangEditor from '@/components/WangEditor/WangEditor.vue'; // 引入编辑器组件

defineOptions({
  name: 'activityForm'
});

const rules = ref({
  
});

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {
    avatar: '',
    title: '',
    time: '',
    content: '',
    status: '',
  },
  api: undefined,
  getTableList: undefined
});

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  paramsProps.value = params;
  visible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref();
const handleSubmit = (type:any) => {
  ruleFormRef.value!.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      paramsProps.value.row.status = type==1? '1':'2';
      await paramsProps.value.api!(paramsProps.value.row);
      ElMessage.success({ message: `审批${type==1?'通过':'不通过'}！` });
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

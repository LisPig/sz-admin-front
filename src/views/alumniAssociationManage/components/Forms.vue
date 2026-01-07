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
      <el-form-item label="校友会头像" prop="avatar">
        <img :src="paramsProps.row.avatar" style="width: 60px;height: 60px;" />
      </el-form-item>

      <!-- 校友会名称 -->
      <el-form-item label="校友会名称" prop="name">
        <el-input v-model="paramsProps.row.name" disabled></el-input>
      </el-form-item>

      <!-- 联系人 -->
      <el-form-item label="联系人" prop="contract">
        <el-input v-model="paramsProps.row.contract" disabled></el-input>
      </el-form-item>

      <!-- 联系电话 -->
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="paramsProps.row.phone" disabled></el-input>
      </el-form-item>

      <!-- 简介 -->
      <el-form-item label="简介" prop="description">
        <el-input type="textarea" v-model="paramsProps.row.description" disabled></el-input>
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

defineOptions({
  name: 'bannerForm'
});

const rules = ref({
  
});

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {
    avatar: '',
    name: '',
    contract: '',
    phone: '',
    status: '',
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

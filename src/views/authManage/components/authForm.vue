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

      <!-- 申请人手机号 -->
      <el-form-item label="申请人手机号" prop="phone">
        <el-input v-model="paramsProps.row.phone" disabled></el-input>
      </el-form-item>

      <!-- 申请人姓名 -->
      <el-form-item label="申请人姓名" prop="name">
        <el-input v-model="paramsProps.row.name" disabled></el-input>
      </el-form-item>

      <!-- 申请人身份证 -->
      <el-form-item label="申请人身份证" prop="idCard">
        <el-input v-model="paramsProps.row.idCard" disabled></el-input>
      </el-form-item>

      <!-- 申请人身份 -->
      <el-form-item label="申请人身份" prop="identity">
        <el-select v-model="paramsProps.row.identity" disabled>
          <el-option label="校友" :value="1"></el-option>
          <el-option label="教师" :value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleSubmit(2)"> 不通过 </el-button>
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
    phone: '',
    name: '',
    idCard: '',
    identity: '',
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
      paramsProps.value.row.status = type==1? '2':'3';
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

<template>
  <el-dialog 
    v-model="dialogVisible" 
    :title="dialogTitle" 
    width="50%" 
    :before-close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="formData" 
      :rules="formRules" 
      label-width="120px"
      :disabled="formDisabled"
    >
      <el-form-item label="校友会名称" prop="name">
        <el-input 
          v-model="formData.name" 
          placeholder="请输入校友会名称" 
          :disabled="isApprovalOperation"
        />
      </el-form-item>
      
      <el-form-item label="联系人" prop="contract">
        <el-input 
          v-model="formData.contract" 
          placeholder="请输入联系人" 
          :disabled="isApprovalOperation"
        />
      </el-form-item>
      
      <el-form-item label="联系方式" prop="phone">
        <el-input 
          v-model="formData.phone" 
          placeholder="请输入联系方式" 
          :disabled="isApprovalOperation"
        />
      </el-form-item>
      
      <el-form-item label="校友会头像" prop="avatar">
        <SimplifyUpload 
          v-model="formData.avatar" 
          :limit="1" 
          :show-file-list="false"
          :disabled="isApprovalOperation"
        />
      </el-form-item>
      
      <el-form-item label="校友会描述" prop="description">
        <el-input 
          v-model="formData.description" 
          type="textarea" 
          placeholder="请输入校友会描述" 
          :rows="4"
          :disabled="isApprovalOperation"
        />
      </el-form-item>
      
      <el-form-item 
        v-if="isApprovalOperation" 
        label="审批结果" 
        prop="status"
      >
        <el-radio-group v-model="formData.status">
          <el-radio label="1">通过</el-radio>
          <el-radio label="2">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          v-if="isApprovalOperation" 
          type="danger" 
          @click="submitForm('reject')"
        >
          拒绝
        </el-button>
        <el-button 
          v-if="isApprovalOperation" 
          type="primary" 
          @click="submitForm('approve')"
        >
          通过
        </el-button>
        <el-button 
          v-if="!isApprovalOperation" 
          type="primary" 
          @click="submitForm('save')"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { editAlumniAssociation, updateAlumniAssociation } from '@/api/modules/alumniAssociation';
import SimplifyUpload from '@/components/SimplifyUpload/index.vue';

// 定义 emits
const emit = defineEmits(['update:modelValue']);

interface FormParams {
  title: string;
  row: any;
  isEdit?: boolean;
  api?: Function;
  getTableList?: Function;
}

interface FormData {
  id?: number;
  name: string;
  contract: string;
  phone: string;
  avatar: string;
  description: string;
  status?: string;
}

const dialogVisible = ref(false);
const formRef = ref();
const dialogTitle = ref('');
const formData = ref<FormData>({
  name: '',
  contract: '',
  phone: '',
  avatar: '',
  description: '',
  status: undefined
});
const formDisabled = ref(false);
const isApprovalOperation = ref(false);
let getTableListFunc: (() => void) | null = null;

// 表单验证规则
const formRules = reactive({
  name: [
    { required: true, message: '请输入校友会名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  contract: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  avatar: [
    { required: true, message: '请上传校友会头像', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入校友会描述', trigger: 'blur' }
  ]
});

// 接收父组件传来的参数
const acceptParams = (params: FormParams) => {
  dialogTitle.value = params.title;
  isApprovalOperation.value = params.title.includes('审批');
  getTableListFunc = params.getTableList || null;
  
  // 初始化表单数据
  formData.value = {
    id: params.row.id || undefined,
    name: params.row.name || '',
    contract: params.row.contract || '',
    phone: params.row.phone || '',
    avatar: params.row.avatar || '',
    description: params.row.description || '',
    status: params.row.status || undefined
  };

  // 根据操作类型设置表单是否禁用
  if (isApprovalOperation.value) {
    formDisabled.value = false; // 审批时不完全禁用，只需禁用部分字段
  } else {
    formDisabled.value = false; // 编辑时不禁用
  }

  dialogVisible.value = true;
};

// 提交表单
const submitForm = async (action: 'save' | 'approve' | 'reject') => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    
    let submitData = { ...formData.value };
    
    if (action === 'approve' || action === 'reject') {
      // 审批操作
      submitData.status = action === 'approve' ? '1' : '2';
      await editAlumniAssociation(submitData);
      ElMessage.success(action === 'approve' ? '审批通过成功' : '审批拒绝成功');
    } else {
      // 保存操作 - 使用PUT方法更新校友会信息
      await updateAlumniAssociation(submitData);
      ElMessage.success('保存成功');
    }
    
    dialogVisible.value = false;
    // 调用父组件传递的刷新列表方法
    if (getTableListFunc && typeof getTableListFunc === 'function') {
      getTableListFunc();
    } else {
      // 如果没有传递getTableList，则尝试触发事件
      emit('update:modelValue', false);
    }
  } catch (error) {
    console.error('表单验证失败:', error);
    ElMessage.error('请检查表单数据');
  }
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
};

// 暴露方法给父组件使用
defineExpose({
  acceptParams
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
 justify-content: flex-end;
}
</style>
<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 30vh; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ref, shallowRef, onBeforeUnmount, watch } from 'vue';
import { useUserStore } from '@/stores/modules/user';
const userStore = useUserStore();

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const editorRef = shallowRef();
const valueHtml = ref(props.modelValue);
const mode = ref('default'); // 或 'simple'

// 工具栏配置
const toolbarConfig = {
  excludeKeys: ['uploadVideo', 'insertVideo']
};

// 编辑器配置
const editorConfig = {
  readOnly: props.disabled, // 初始禁用状态
  MENU_CONF: {
    uploadImage: {
      server: '/api/sys-file/upload',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'clientId': import.meta.env.VITE_APP_CLIENT_ID,
      },
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024,
      allowedFileTypes: ['image/*'],
      meta: { dirTag: 'article' },
      customInsert(res: any, insertFn: any) {
        if (res.data?.url) insertFn(res.data.url);
      }
    }
  }
};

// 编辑器创建回调
const handleCreated = (editor: any) => {
  editorRef.value = editor;
  // 初始禁用状态
  if (props.disabled) {
    editor.disable();
  }
};

// 监听禁用状态变化
watch(() => props.disabled, (newVal) => {
  if (!editorRef.value) return;
  newVal ? editorRef.value.disable() : editorRef.value.enable();
});

// 监听内容变化
watch(valueHtml, (newVal) => {
  emit('update:modelValue', newVal);
});

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<style>
/* 可选：禁用状态下的样式 */
.w-e-text-container[data-readonly="true"] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
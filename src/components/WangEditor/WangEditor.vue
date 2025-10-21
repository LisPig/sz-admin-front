<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ref, shallowRef, onBeforeUnmount, watch, computed } from 'vue';
import { useUserStore } from '@/stores/modules/user';
const userStore = useUserStore();

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const editorRef = shallowRef();
const valueHtml = ref(props.modelValue);

// 只隐藏视频相关按钮，保留上传图片功能
const toolbarConfig = {
  excludeKeys: ['uploadVideo', 'insertVideo']
};

const editorConfig = {
  MENU_CONF: {
    uploadImage: {
      server: '/api/sys-file/upload',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'clientId': import.meta.env.VITE_APP_CLIENT_ID,
      },
      fieldName: 'file', // 上传表单的字段名
      maxFileSize: 10 * 1024 * 1024, // 10M
      allowedFileTypes: ['image/*'], // 允许的图片类型
      meta: {
        dirTag: 'article' // 添加额外的字段
      },
      customInsert(res: any, insertFn: any) {
        // 根据后端返回结构调整
        if (res.data && res.data.url) {
          insertFn(res.data.url);
        }
      },
      onError(file: File, err: Error, res: any) {
        console.error('图片上传失败', file, err, res);
      },
      onSuccess(file: File, res: any) {
        console.log('图片上传成功', file, res);
      }
    }
  }
};

const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

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
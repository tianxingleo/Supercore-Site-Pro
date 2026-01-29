<template>
  <div class="richtext-editor">
    <div
      v-if="editor"
      class="border border-swiss-text/10 overflow-hidden"
      :class="{ 'ring-2 ring-swiss-accent-blue': focused }"
    >
      <div
        class="flex flex-wrap items-center gap-1 p-2 bg-swiss-bg-soft border-b border-swiss-text/10"
      >
        <button
          type="button"
          v-for="button in buttons"
          :key="button.name"
          @click="button.action"
          :class="[
            'p-2 rounded-lg transition-all',
            'hover:bg-swiss-text/10',
            'focus:outline-none',
            button.active?.()
              ? 'bg-swiss-text text-white'
              : 'text-swiss-text/60 hover:text-swiss-text',
            button.disabled?.() ? 'opacity-30 pointer-events-none' : '',
          ]"
          :title="button.title"
        >
          <UIcon :name="button.icon" class="w-4 h-4" />
        </button>
      </div>

      <EditorContent
        :editor="editor"
        class="prose prose-sm max-w-none p-4 min-h-[400px] bg-white"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>

    <div v-else class="w-full h-[400px] bg-swiss-bg border border-swiss-text/10 p-4">
      載入編輯器中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import type { Ref } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const focused = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      // Exclude Link extension to avoid duplicate with our custom Link configuration
      link: false,
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-swiss-accent-blue underline',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none prose prose-sm max-w-none',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value, { emitUpdate: false })
    }
  }
)

const buttons = computed(() => {
  if (!editor.value) return []

  return [
    {
      name: 'bold',
      icon: 'i-heroicons-bold',
      title: '粗體',
      action: () => editor.value?.chain().focus().toggleBold().run(),
      active: () => editor.value?.isActive('bold'),
    },
    {
      name: 'italic',
      icon: 'i-heroicons-italic',
      title: '斜體',
      action: () => editor.value?.chain().focus().toggleItalic().run(),
      active: () => editor.value?.isActive('italic'),
    },
    {
      name: 'strike',
      icon: 'i-heroicons-x-mark',
      title: '刪除線',
      action: () => editor.value?.chain().focus().toggleStrike().run(),
      active: () => editor.value?.isActive('strike'),
    },
    {
      name: 'divider1',
      icon: 'i-heroicons-minus',
      title: '',
      action: () => {},
      disabled: () => true,
    },
    {
      name: 'h1',
      icon: 'i-heroicons-chevron-double-down',
      title: '標題 1',
      action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
      active: () => editor.value?.isActive('heading', { level: 1 }),
    },
    {
      name: 'h2',
      icon: 'i-heroicons-chevron-down',
      title: '標題 2',
      action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: () => editor.value?.isActive('heading', { level: 2 }),
    },
    {
      name: 'h3',
      icon: 'i-heroicons-minus',
      title: '標題 3',
      action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: () => editor.value?.isActive('heading', { level: 3 }),
    },
    {
      name: 'paragraph',
      icon: 'i-heroicons-document-text',
      title: '段落',
      action: () => editor.value?.chain().focus().setParagraph().run(),
      active: () => editor.value?.isActive('paragraph'),
    },
    {
      name: 'divider2',
      icon: 'i-heroicons-minus',
      title: '',
      action: () => {},
      disabled: () => true,
    },
    {
      name: 'bulletList',
      icon: 'i-heroicons-bars-3',
      title: '無序列表',
      action: () => editor.value?.chain().focus().toggleBulletList().run(),
      active: () => editor.value?.isActive('bulletList'),
    },
    {
      name: 'orderedList',
      icon: 'i-heroicons-list-bullet',
      title: '有序列表',
      action: () => editor.value?.chain().focus().toggleOrderedList().run(),
      active: () => editor.value?.isActive('orderedList'),
    },
    {
      name: 'divider3',
      icon: 'i-heroicons-minus',
      title: '',
      action: () => {},
      disabled: () => true,
    },
    {
      name: 'textAlignLeft',
      icon: 'i-heroicons-arrow-left',
      title: '左對齊',
      action: () => editor.value?.chain().focus().setTextAlign('left').run(),
      active: () => editor.value?.isActive({ textAlign: 'left' }),
    },
    {
      name: 'textAlignCenter',
      icon: 'i-heroicons-arrows-left-right',
      title: '居中對齊',
      action: () => editor.value?.chain().focus().setTextAlign('center').run(),
      active: () => editor.value?.isActive({ textAlign: 'center' }),
    },
    {
      name: 'textAlignRight',
      icon: 'i-heroicons-arrow-right',
      title: '右對齊',
      action: () => editor.value?.chain().focus().setTextAlign('right').run(),
      active: () => editor.value?.isActive({ textAlign: 'right' }),
    },
    {
      name: 'divider4',
      icon: 'i-heroicons-minus',
      title: '',
      action: () => {},
      disabled: () => true,
    },
    {
      name: 'undo',
      icon: 'i-heroicons-arrow-uturn-left',
      title: '撤銷',
      action: () => editor.value?.chain().focus().undo().run(),
    },
    {
      name: 'redo',
      icon: 'i-heroicons-arrow-uturn-right',
      title: '重做',
      action: () => editor.value?.chain().focus().redo().run(),
    },
  ]
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
:deep(.ProseMirror) {
  outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  line-height: 1.2;
  margin: 1em 0 0.5em;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  line-height: 1.3;
  margin: 1em 0 0.5em;
}

:deep(.ProseMirror h3) {
  font-size: 1.25em;
  font-weight: bold;
  line-height: 1.4;
  margin: 1em 0 0.5em;
}

:deep(.ProseMirror p) {
  margin: 0.75em 0;
  line-height: 1.8;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 0.75em 0;
}

:deep(.ProseMirror li) {
  margin: 0.25em 0;
}

:deep(.ProseMirror a) {
  color: #0071e3;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ProseMirror a:hover) {
  color: #0052cc;
}

:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
  border-radius: 8px;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid #000;
  padding-left: 1em;
  margin: 1em 0;
  color: #666;
  font-style: italic;
}

:deep(.ProseMirror code) {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.ProseMirror pre) {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

:deep(.ProseMirror pre code) {
  background-color: transparent;
  padding: 0;
}
</style>

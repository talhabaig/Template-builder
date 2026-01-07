<template>
  <div class="template-editor">
    <h1>Template Editor</h1>
    
    <!-- CKEditor component -->
    <ckeditor 
      :editor="editor" 
      v-model="editorData" 
      :config="editorConfig" 
    ></ckeditor>

    <!-- Output Editor Data (for debugging) -->
    <div>
      <h3>Editor Output:</h3>
      <pre>{{ editorData }}</pre>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'TemplateEditor',
  data() {
    return {
      // CKEditor build and config
      editor: ClassicEditor,
      editorData: '<p>Start your notice here...</p>', // Initial content
      editorConfig: {
        toolbar: [
          'bold', 
          'italic', 
          'bulletedList', 
          'numberedList', 
          '|', 
          'undo', 
          'redo'
        ]
      }
    }
  }
}
</script>

<style scoped>
.template-editor {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.ck-editor__editable {
  min-height: 300px; /* Adjust as needed */
}

h1 {
  text-align: center;
  color: #333;
}

pre {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-wrap; 
  word-wrap: break-word;
}
</style>

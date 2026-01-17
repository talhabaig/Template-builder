<template>
  <div class="template-editor">
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <input
          v-model="templateName"
          type="text"
          placeholder="Template Name"
          class="template-name-input"
        />
        <input
          v-model="templateDescription"
          type="text"
          placeholder="Description (optional)"
          class="template-desc-input"
        />
      </div>
      <div class="toolbar-right">
        <button
          class="btn btn-secondary"
          @click="loadTemplate"
        >
          Load
        </button>
        <button
          class="btn btn-primary"
          @click="saveTemplate"
        >
          Save
        </button>
        <button
          class="btn btn-success"
          @click="exportTemplate"
        >
          Export DOCX
        </button>
      </div>
    </div>
    
    <div class="editor-container">
      <button
        v-if="showMobileVariableToggle"
        class="mobile-toggle-btn"
        @click="toggleVariablePanel"
      >
        {{ showVariablePanel ? '✕ Close Variables' : '☰ Variables' }}
      </button>
      <VariablePanel
        v-show="showVariablePanel"
        class="variable-panel-wrapper"
        :show-close-button="isMobile"
        @insert-variable="handleInsertVariable"
        @insert-loop="handleInsertLoop"
        @close-panel="toggleVariablePanel"
      />
      
      <div class="editor-content">
        <ckeditor
          :editor="editor"
          v-model="editorData"
          :config="editorConfig"
          @ready="onEditorReady"
        />
        
        <div class="editor-footer">
          <div class="editor-info">
            <span>Characters: {{ characterCount }}</span>
            <span>Variables: {{ variableCount }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Template Load Modal -->
    <div
      v-if="showLoadModal"
      class="modal-overlay"
      @click="showLoadModal = false"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h3>Load Template</h3>
          <button
            class="modal-close"
            @click="showLoadModal = false"
          >
            ×
          </button>
        </div>
        <div class="modal-body">
          <div
            v-if="availableTemplates.length === 0"
            class="no-templates"
          >
            No saved templates found
          </div>
          <div
            v-else
            class="template-list"
          >
            <div
              v-for="template in availableTemplates"
              :key="template.id"
              class="template-list-item"
              @click="selectTemplate(template)"
            >
              <div class="template-list-name">{{ template.name }}</div>
              <div class="template-list-desc">{{ template.description || 'No description' }}</div>
              <div class="template-list-meta">
                Updated: {{ formatDate(template.updatedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import VariablePanel from '@/components/variables/VariablePanel.vue'
import { htmlToDocxTemplate, docxTemplateToHtml } from '@/utils/templateConverter'
import { getAllTemplates, saveTemplate as saveTemplateToStorage, getTemplate } from '@/utils/templateStorage'
import { exportToDocx } from '@/utils/docxHandler'

export default {
  name: 'TemplateEditor',
  components: {
    VariablePanel
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorInstance: null,
      templateName: '',
      templateDescription: '',
      templateId: null,
      showLoadModal: false,
      availableTemplates: [],
      showVariablePanel: true,
      isMobile: false,
      resizeTimeout: null,
      resizeHandler: null,
      editorConfig: {
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'alignment',
          '|',
          'link',
          'blockQuote',
          'insertTable',
          '|',
          'undo',
          'redo'
        ],
        placeholder: 'Start typing your template here... Use the Variables panel to insert placeholders.',
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
          ]
        }
      }
    }
  },
  computed: {
    characterCount() {
      const text = htmlToDocxTemplate(this.editorData)
      return text.length
    },
    variableCount() {
      const text = htmlToDocxTemplate(this.editorData)
      const matches = text.match(/\{[^}]+\}/g)
      return matches ? matches.length : 0
    },
    showMobileVariableToggle() {
      return this.isMobile
    }
  },
  mounted() {
    this.loadAvailableTemplates()
    this.checkMobile()
    // Debounce resize to prevent closing panel when keyboard appears
    this.resizeHandler = () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout)
      }
      this.resizeTimeout = setTimeout(() => {
        this.checkMobile()
      }, 150)
    }
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  },
  methods: {
    onEditorReady(editor) {
      this.editorInstance = editor
      
      // Add custom styles for variable tokens in editor
      const style = document.createElement('style')
      style.textContent = `
        /* Style variable patterns in editor content */
        .ck-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Note: CKEditor sanitizes HTML, so we style via CSS targeting patterns */
        /* Variables will appear as regular text but can be styled via post-processing if needed */
      `
      document.head.appendChild(style)
    },
    
    handleInsertVariable({ variable, parentLoop }) {
      if (!this.editorInstance) return
      
      const model = this.editorInstance.model
      const selection = model.document.selection
      const range = selection.getFirstRange()
      
      // Create a styled span for the variable token
      const variableSyntax = variable.syntax
      const variableHtml = `<span class="variable-token" data-variable-syntax="${variableSyntax}" contenteditable="false">${variableSyntax}</span>`
      
      // Get current HTML, insert variable, then set back
      const currentHtml = this.editorData || ''
      const viewFragment = this.editorInstance.data.processor.toView(currentHtml)
      
      // For simplicity, insert as HTML using the editor's HTML data
      // We'll use a simpler approach: insert text and let CSS style it
      model.change(writer => {
        writer.insertText(variableSyntax, range.start)
      })
      
      // Focus the editor
      this.editorInstance.editing.view.focus()
    },
    
    handleInsertLoop({ variable }) {
      if (!this.editorInstance) return
      
      const model = this.editorInstance.model
      const selection = model.document.selection
      const range = selection.getFirstRange()
      
      // Create loop block with start and end tags
      const loopVar = variable.id.replace(/^case\./, '')
      const loopStart = `{#${loopVar}}`
      const loopEnd = `{/${loopVar}}`
      
      model.change(writer => {
        // Insert start tag
        writer.insertText(loopStart, range.start)
        
        // Insert newline and placeholder
        const afterStart = writer.createPositionAfter(range.start)
        writer.insertText('\n  [Insert content here - use Variables panel for inner variables]\n', afterStart)
        
        // Insert end tag
        const beforeEnd = writer.createPositionAfter(afterStart)
        writer.insertText(loopEnd, beforeEnd)
      })
      
      // Focus the editor
      this.editorInstance.editing.view.focus()
    },
    
    saveTemplate() {
      if (!this.templateName.trim()) {
        alert('Please enter a template name')
        return
      }
      
      // Check if editor has content
      const docxContent = htmlToDocxTemplate(this.editorData)
      if (!docxContent.trim()) {
        alert('Please add some content to the template before saving')
        return
      }
      
      // If editing an existing template, ask for confirmation
      if (this.templateId) {
        const confirmed = confirm(
          `You are about to update the existing template "${this.templateName}".\n\n` +
          'This will overwrite the previous version. Are you sure you want to continue?'
        )
        if (!confirmed) {
          return
        }
      }
      
      const template = {
        id: this.templateId,
        name: this.templateName.trim(),
        description: this.templateDescription.trim(),
        content: docxContent, // Store as docxtemplater-compatible text
        htmlContent: this.editorData, // Store HTML for editor
        metadata: {
          characterCount: this.characterCount,
          variableCount: this.variableCount
        }
      }
      
      const success = saveTemplateToStorage(template)
      if (success) {
        this.templateId = template.id || this.templateId
        alert('Template saved successfully!')
        this.loadAvailableTemplates()
        
        // Clear editor and form fields for new template
        this.templateName = ''
        this.templateDescription = ''
        this.editorData = ''
        this.templateId = null
      } else {
        alert('Error saving template')
      }
    },
    
    loadTemplate() {
      this.loadAvailableTemplates()
      this.showLoadModal = true
    },
    
    selectTemplate(template) {
      this.templateName = template.name
      this.templateDescription = template.description || ''
      this.templateId = template.id
      
      // Load HTML content if available, otherwise convert from docx format
      if (template.htmlContent) {
        this.editorData = template.htmlContent
      } else {
        this.editorData = docxTemplateToHtml(template.content)
      }
      
      this.showLoadModal = false
    },
    
    loadAvailableTemplates() {
      this.availableTemplates = getAllTemplates()
    },
    
    async exportTemplate() {
      if (!this.templateName.trim()) {
        alert('Please enter a template name before exporting')
        return
      }
      
      try {
        const docxContent = htmlToDocxTemplate(this.editorData)
        
        // Export as DOCX file
        const blob = await exportToDocx(docxContent, this.templateName)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${this.templateName.replace(/\s+/g, '_')}.docx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        alert('Template exported as DOCX file successfully!')
      } catch (error) {
        console.error('Export error:', error)
        alert(`Error exporting template: ${error.message}`)
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Unknown'
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },
    
    checkMobile() {
      const wasMobile = this.isMobile
      this.isMobile = window.innerWidth <= 768
      
      // Only change panel state if switching between mobile/desktop
      // Don't reset if already on mobile (to prevent closing when keyboard appears)
      if (!wasMobile && this.isMobile) {
        // Just switched to mobile - hide panel by default
        this.showVariablePanel = false
      } else if (wasMobile && !this.isMobile) {
        // Just switched to desktop - show panel
        this.showVariablePanel = true
      }
      // If already on mobile and staying on mobile, don't change panel state
    },
    
    toggleVariablePanel() {
      this.showVariablePanel = !this.showVariablePanel
    }
  }
}
</script>

<style scoped>
.template-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.template-name-input,
.template-desc-input {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.template-name-input {
  width: 200px;
  min-width: 150px;
}

.template-desc-input {
  width: 300px;
  min-width: 200px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}


.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  flex-direction: row;
}

/* Mobile Responsive Styles */
.mobile-toggle-btn {
  display: none;
}

@media (max-width: 768px) {
  .editor-toolbar {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
  }

  .toolbar-left {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .template-name-input,
  .template-desc-input {
    width: 100%;
    min-width: 100%;
  }

  .toolbar-right {
    width: 100%;
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    padding: 8px 12px;
  }

  .editor-container {
    flex-direction: column;
    position: relative;
  }

  .mobile-toggle-btn {
    display: block;
    width: 100%;
    padding: 12px;
    background: #007bff;
    color: white;
    border: none;
    border-bottom: 1px solid #0056b3;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    z-index: 10;
  }

  .mobile-toggle-btn:active {
    background: #0056b3;
  }

  .variable-panel-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    touch-action: manipulation; /* Prevent double-tap zoom on mobile */
  }
  
  .variable-panel-wrapper * {
    touch-action: manipulation;
  }

  .editor-content {
    min-height: 300px;
    width: 100%;
  }

  .editor-content >>> .ck-content {
    min-height: 300px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .modal-content {
    width: 95%;
    max-width: 95%;
    margin: 10px;
  }
}

@media (max-width: 480px) {
  .editor-toolbar {
    padding: 8px;
  }

  .btn {
    font-size: 11px;
    padding: 6px 8px;
  }

  .editor-info {
    flex-direction: column;
    gap: 4px;
    font-size: 11px;
  }
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-content >>> .ck-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-content >>> .ck-editor__main {
  flex: 1;
  overflow: auto;
}

.editor-content >>> .ck-content {
  min-height: 400px;
  font-size: 14px;
  line-height: 1.6;
}

/* Style CKEditor headings. Some existing content may use custom tags like <heading1> etc;
   include both semantic h1/h2/h3 and legacy heading1/heading2/heading3 selectors. */
.editor-content >>> .ck-content heading1,
.editor-content >>> .ck-content h1,
.editor-content >>> .ck-content .ck-heading_heading1 {
  font-size: 1.8em !important;
  font-weight: 700 !important;
  margin: 0.67em 0 !important;
}
.editor-content >>> .ck-content heading2,
.editor-content >>> .ck-content h2,
.editor-content >>> .ck-content .ck-heading_heading2 {
  font-size: 1.4em !important;
  font-weight: 600 !important;
  margin: 0.75em 0 !important;
}
.editor-content >>> .ck-content heading3,
.editor-content >>> .ck-content h3,
.editor-content >>> .ck-content .ck-heading_heading3 {
  font-size: 1.2em !important;
  font-weight: 600 !important;
  margin: 0.85em 0 !important;
}

.editor-footer {
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.editor-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6c757d;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #212529;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.no-templates {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-list-item {
  padding: 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-list-item:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.template-list-name {
  font-weight: 600;
  font-size: 16px;
  color: #212529;
  margin-bottom: 4px;
}

.template-list-desc {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 4px;
}

.template-list-meta {
  font-size: 12px;
  color: #adb5bd;
}
</style>

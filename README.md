# ScheduleADR Template Editor

A modern Vue.js WYSIWYG template builder for ScheduleADR. Enables non-technical users to visually create, edit, and manage legal notice templates compatible with docxtemplater.

---

## Features

- **Rich Text Editing**: Compose templates with CKEditor 5
- **Variable Insertion**: Insert variables and loops with a click
- **Template Management**: Save, load, and delete templates (localStorage)
- **Export**: Download templates as JSON for backend use
- **Mobile Responsive**: Usable on desktop and mobile

---

## Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn

### Install & Run
```bash
npm install
npm run serve
```
Visit: http://localhost:8080

---

## Usage

### Creating a Template
1. Enter a name and (optional) description
2. Compose content in the editor
3. Insert variables from the Variables panel
4. Click **Save**

### Loading/Deleting Templates
- Click **Load** to view, select, or delete saved templates

### Exporting
- Click **Export JSON** to download the template for backend integration

---

## Project Structure
```
src/
  components/
    editor/TemplateEditor.vue      # Main editor UI
    variables/VariablePanel.vue    # Variable browser/inserter
  data/variables.js                # Variable definitions
  utils/
    templateStorage.js             # Local storage logic
    templateConverter.js           # HTML <-> docxtemplater conversion
  views/HomeView.vue               # Main app view
```

---

## Code Standards & Naming
- **PascalCase** for Vue components (e.g., `TemplateEditor.vue`)
- **camelCase** for variables and methods (e.g., `saveTemplate`, `loadAvailableTemplates`)
- **UPPER_SNAKE_CASE** for constants (e.g., `STORAGE_KEY`)
- All files and folders use clear, descriptive names
- No `var` usage; only `const` and `let`
- No unused code or console logs in production

---

## Customization
- Add new variables in `src/data/variables.js`
- Editor toolbar and plugins: see `editorConfig` in `TemplateEditor.vue`
- Styles: scoped in each `.vue` file, global in `App.vue`

---

## Integration
- Exported templates are docxtemplater-compatible
- For backend (Rails):
  - Replace localStorage logic in `templateStorage.js` with API calls
  - Use exported JSON for document generation

---

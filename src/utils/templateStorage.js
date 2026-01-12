/**
 * Template storage utilities
 * For prototype, uses localStorage. In production, this would connect to Rails backend
 */

const STORAGE_KEY = 'scheduleadr_templates'

/**
 * Get all saved templates
 */
export function getAllTemplates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading templates:', error)
    return []
  }
}

/**
 * Get a template by ID
 */
export function getTemplate(id) {
  const templates = getAllTemplates()
  return templates.find(t => t.id === id)
}

/**
 * Save a template
 */
export function saveTemplate(template) {
  const templates = getAllTemplates()
  
  if (template.id) {
    // Update existing
    const index = templates.findIndex(t => t.id === template.id)
    if (index !== -1) {
      templates[index] = {
        ...template,
        updatedAt: new Date().toISOString()
      }
    } else {
      templates.push({
        ...template,
        updatedAt: new Date().toISOString()
      })
    }
  } else {
    // Create new
    const newTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    templates.push(newTemplate)
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    return true
  } catch (error) {
    console.error('Error saving template:', error)
    return false
  }
}

/**
 * Delete a template
 */
export function deleteTemplate(id) {
  const templates = getAllTemplates()
  const filtered = templates.filter(t => t.id !== id)
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting template:', error)
    return false
  }
}

/**
 * Generate a unique ID
 */
function generateId() {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Export template for backend (docxtemplater format)
 */
export function exportTemplate(template) {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    content: template.content, // This should be the docxtemplater-compatible text
    metadata: template.metadata || {}
  }
}

/**
 * Import template from backend
 */
export function importTemplate(templateData) {
  return {
    id: templateData.id,
    name: templateData.name,
    description: templateData.description || '',
    content: templateData.content,
    metadata: templateData.metadata || {},
    createdAt: templateData.createdAt || new Date().toISOString(),
    updatedAt: templateData.updatedAt || new Date().toISOString()
  }
}

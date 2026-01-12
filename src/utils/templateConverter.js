/**
 * Utility functions for converting between editor HTML and docxtemplater syntax
 */

/**
 * Convert HTML content from editor to docxtemplater-compatible text
 * This extracts variable tokens from HTML and converts them to plain text syntax
 */
export function htmlToDocxTemplate(html) {
  if (!html) return ''
  
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  // First, handle any spans with data attributes (if they exist)
  const variableSpans = tempDiv.querySelectorAll('[data-variable-syntax]')
  variableSpans.forEach(span => {
    const syntax = span.getAttribute('data-variable-syntax')
    const textNode = document.createTextNode(syntax)
    span.parentNode.replaceChild(textNode, span)
  })
  
  // Replace loop blocks with data attributes
  const loopBlocks = tempDiv.querySelectorAll('[data-loop-start], [data-loop-end]')
  loopBlocks.forEach(block => {
    if (block.hasAttribute('data-loop-start')) {
      const syntax = block.getAttribute('data-loop-start')
      const textNode = document.createTextNode(syntax)
      block.parentNode.replaceChild(textNode, block)
    } else if (block.hasAttribute('data-loop-end')) {
      const syntax = block.getAttribute('data-loop-end')
      const textNode = document.createTextNode(syntax)
      block.parentNode.replaceChild(textNode, block)
    }
  })
  
  // Get text content, preserving line breaks
  // CKEditor uses <p> tags for paragraphs and <br> for line breaks
  let text = tempDiv.textContent || tempDiv.innerText || ''
  
  // Convert paragraph breaks to newlines
  // CKEditor typically uses <p> tags, so we need to handle those
  const paragraphs = tempDiv.querySelectorAll('p')
  if (paragraphs.length > 0) {
    text = Array.from(paragraphs)
      .map(p => p.textContent || '')
      .join('\n')
  }
  
  // Handle <br> tags as newlines
  text = text.replace(/<br\s*\/?>/gi, '\n')
  
  // Clean up extra whitespace but preserve intentional line breaks
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple blank lines to double
  text = text.replace(/[ \t]+/g, ' ') // Multiple spaces to single
  
  return text.trim()
}

/**
 * Convert docxtemplater syntax to HTML for editor display
 * This creates visual tokens/placeholders for variables
 */
export function docxTemplateToHtml(text) {
  if (!text) return ''
  
  let html = text
  
  // Escape HTML first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Convert line breaks
  html = html.replace(/\n/g, '<br>')
  
  // Match and replace loop blocks first (they contain variables)
  // Pattern: {#variable}...{/variable}
  html = html.replace(/\{#([^}]+)\}/g, (match, varName) => {
    const id = `loop-${varName.replace(/\./g, '-')}`
    return `<span class="variable-loop-start" data-loop-start="${match}" data-loop-id="${id}" contenteditable="false">${match}</span>`
  })
  
  html = html.replace(/\{\/([^}]+)\}/g, (match, varName) => {
    const id = `loop-${varName.replace(/\./g, '-')}`
    return `<span class="variable-loop-end" data-loop-end="${match}" data-loop-id="${id}" contenteditable="false">${match}</span>`
  })
  
  // Match and replace simple variables
  // Pattern: {variable.name}
  html = html.replace(/\{([^#\/}]+)\}/g, (match, varName) => {
    // Skip if already processed as part of a loop
    if (match.includes('variable-loop')) {
      return match
    }
    const id = `var-${varName.replace(/\./g, '-')}`
    return `<span class="variable-token" data-variable-syntax="${match}" data-variable-id="${id}" contenteditable="false">${match}</span>`
  })
  
  return html
}

/**
 * Extract all variables from a template string
 */
export function extractVariables(template) {
  const variables = []
  const variableRegex = /\{([^#\/}]+)\}/g
  const loopRegex = /\{#([^}]+)\}/g
  
  let match
  
  // Extract simple variables
  while ((match = variableRegex.exec(template)) !== null) {
    variables.push({
      type: 'variable',
      syntax: match[0],
      name: match[1]
    })
  }
  
  // Extract loop starts
  while ((match = loopRegex.exec(template)) !== null) {
    variables.push({
      type: 'loop',
      syntax: match[0],
      name: match[1]
    })
  }
  
  return variables
}

/**
 * Validate template syntax
 */
export function validateTemplate(template) {
  const errors = []
  const warnings = []
  
  // Check for unmatched loop tags
  const loopStarts = (template.match(/\{#([^}]+)\}/g) || []).length
  const loopEnds = (template.match(/\{\/([^}]+)\}/g) || []).length
  
  if (loopStarts !== loopEnds) {
    errors.push(`Unmatched loop tags: ${loopStarts} starts, ${loopEnds} ends`)
  }
  
  // Check for malformed variable syntax
  const malformed = template.match(/\{[^#\/}]*[^}]*$/g)
  if (malformed) {
    errors.push('Malformed variable syntax detected')
  }
  
  return { errors, warnings, isValid: errors.length === 0 }
}

/**
 * Utility functions for handling DOCX file import and export
 * Uses docxtemplater and pizzip to read/write DOCX files
 */

import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { Document, Packer, Paragraph, TextRun } from 'docx'

/**
 * Import DOCX file and extract template content
 * @param {File} file - The DOCX file to import
 * @returns {Promise<{content: string, htmlContent: string}>}
 */
export async function importDocx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const zip = new PizZip(e.target.result)
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true
        })
        
        // Get the raw XML content
        const zipFiles = zip.files
        const documentXml = zipFiles['word/document.xml']
        
        if (!documentXml) {
          reject(new Error('Invalid DOCX file: missing document.xml'))
          return
        }
        
        // Extract text content with variables preserved
        // We need to parse the XML to extract text while preserving docxtemplater syntax
        const xmlContent = documentXml.asText()
        
        // Extract text nodes and preserve variable syntax
        // This is a simplified extraction - in production you might want more robust XML parsing
        let content = extractTextFromXml(xmlContent)
        
        // Convert to HTML for editor display
        const htmlContent = docxTemplateToHtml(content)
        
        resolve({
          content,
          htmlContent
        })
      } catch (error) {
        reject(new Error(`Failed to import DOCX: ${error.message}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Export template as DOCX file
 * @param {string} templateContent - The template content with docxtemplater syntax
 * @param {string} templateName - Name for the exported file
 * @returns {Promise<Blob>}
 */
export async function exportToDocx(templateContent, templateName = 'template') {
  try {
    // Use docx library to create properly formatted DOCX
    
    // Split content into paragraphs
    const lines = templateContent.split('\n')
    
    // Convert each line to a paragraph
    const paragraphs = lines.map(line => {
      // Split by variables to preserve them
      // Match: {variable}, {#loop}, {/loop}
      const parts = line.split(/(\{[#\/]?[^}]+\})/g)
      
      // Filter out undefined/null and create text runs
      const textRuns = parts
        .filter(part => part !== undefined && part !== null)
        .map(part => {
          // Create text run, preserving the exact content
          return new TextRun({
            text: part || '',
            preserveSpace: true
          })
        })
      
      // If line is empty or no valid parts, create empty paragraph
      if (line.trim() === '' || textRuns.length === 0) {
        return new Paragraph({
          children: [new TextRun('')]
        })
      }
      
      return new Paragraph({
        children: textRuns
      })
    })
    
    // If no paragraphs, add at least one
    if (paragraphs.length === 0) {
      paragraphs.push(new Paragraph({
        children: [new TextRun('')]
      }))
    }
    
    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    })
    
    // Generate the DOCX file
    const blob = await Packer.toBlob(doc)
    
    return blob
  } catch (error) {
    throw new Error(`Failed to export DOCX: ${error.message}`)
  }
}

/**
 * Extract text content from DOCX XML while preserving docxtemplater variables
 */
function extractTextFromXml(xmlContent) {
  let result = []
  let currentParagraph = []
  
  // Use regex to find all text runs and paragraphs
  // Match <w:t> tags (text runs) and <w:p> tags (paragraphs)
  const textRunRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
  const paragraphRegex = /<w:p[^>]*>([\s\S]*?)<\/w:p>/g
  
  // First, extract paragraphs
  let paragraphMatch
  while ((paragraphMatch = paragraphRegex.exec(xmlContent)) !== null) {
    const paragraphContent = paragraphMatch[1]
    const paragraphText = []
    
    // Extract all text runs in this paragraph
    let textMatch
    while ((textMatch = textRunRegex.exec(paragraphContent)) !== null) {
      let text = textMatch[1]
      
      // Decode XML entities
      text = text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
      
      paragraphText.push(text)
    }
    
    // Reset regex lastIndex for next paragraph
    textRunRegex.lastIndex = 0
    
    if (paragraphText.length > 0) {
      result.push(paragraphText.join(''))
    } else {
      // Empty paragraph
      result.push('')
    }
  }
  
  // If no paragraphs found, try simpler extraction
  if (result.length === 0) {
    const textMatches = xmlContent.match(/<w:t[^>]*>([^<]*)<\/w:t>/g)
    if (textMatches) {
      result = textMatches.map(match => {
        const content = match.replace(/<w:t[^>]*>|<\/w:t>/g, '')
        return content
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
      })
    }
  }
  
  // Join paragraphs with newlines
  let text = result.join('\n')
  
  // Clean up multiple newlines but preserve paragraph breaks
  text = text.replace(/\n{3,}/g, '\n\n')
  
  return text.trim()
}

/**
 * Create document.xml content from template text
 */
function createDocumentXml(templateContent) {
  // Split content into paragraphs (preserve empty lines)
  const lines = templateContent.split('\n')
  
  const paragraphXmls = lines.map(line => {
    // Handle empty paragraphs
    if (line.trim() === '') {
      return '<w:p><w:pPr/><w:r><w:t></w:t></w:r></w:p>'
    }
    
    // Split by variables to preserve them
    // Match variables: {variable}, {#loop}, {/loop}
    const parts = line.split(/(\{[#\/]?[^}]+\})/g)
    
    const runs = []
    parts.forEach(part => {
      if (part.trim() === '') return
      
      // Check if this is a variable
      if (part.match(/^\{[#\/]?[^}]+\}$/)) {
        // This is a variable - preserve it exactly
        const escaped = part
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        runs.push(`<w:r><w:t xml:space="preserve">${escaped}</w:t></w:r>`)
      } else {
        // Regular text - escape XML entities
        const escaped = part
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        runs.push(`<w:r><w:t xml:space="preserve">${escaped}</w:t></w:r>`)
      }
    })
    
    // If no runs, create empty paragraph
    if (runs.length === 0) {
      runs.push('<w:r><w:t></w:t></w:r>')
    }
    
    return `<w:p><w:pPr/>${runs.join('')}</w:p>`
  })
  
  // If no paragraphs, add at least one
  if (paragraphXmls.length === 0) {
    paragraphXmls.push('<w:p><w:pPr/><w:r><w:t></w:t></w:r></w:p>')
  }
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${paragraphXmls.join('')}
  </w:body>
</w:document>`
}

/**
 * Get Content Types XML
 */
function getContentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
}

/**
 * Get relationships XML
 */
function getRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
}

/**
 * Get document relationships XML
 */
function getDocumentRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
}

/**
 * Get styles XML
 */
function getStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>`
}

import { docxTemplateToHtml } from './templateConverter'

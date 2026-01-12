/**
 * Sample templates for testing and demonstration
 */

export const sampleTemplates = [
  {
    id: 'sample-1',
    name: 'Notice of Mediation - Sample',
    description: 'A sample notice of mediation template',
    content: `Date: {current_date}

Re: {case.plaintiffs_names} vs. {case.defendants_names}

Court: {case.refferal_source}
County: {case.county}
Civil Action File Number: {case.case_number}

NOTICE OF MEDIATION

The above-referenced case, having been ORDERED to Alternative Dispute Resolution (ADR), has been scheduled for mediation. Attorneys must notify their clients of the time, location and fees due.

Date: {selected_session.session_date}
Time: {selected_session.session_time}
Neutral: {#case.neutrals} {full_name_for_template} {/case.neutrals}
Phone: {#case.neutrals} {office} {/case.neutrals}`,
    htmlContent: '',
    metadata: {
      characterCount: 0,
      variableCount: 0
    }
  },
  {
    id: 'sample-2',
    name: 'Notice of Mediator Assignment - Sample',
    description: 'A sample notice of mediator assignment',
    content: `Date: {current_date}

Re: {case.plaintiffs_names} vs. {case.defendants_names}

Court: {case.refferal_source}
County: {case.county}
Civil Action File Number: {case.case_number}

NOTICE OF MEDIATOR ASSIGNMENT

Please allow this to serve as notification that the above-referenced mediation session has been assigned to:

Mediator: {#case.neutrals} {full_name_for_template} {/case.neutrals}
Phone: {#case.neutrals} {office} {/case.neutrals}

Please refer to the Notice of Mediation for all other information including the date, time, location, etc. of the session.`,
    htmlContent: '',
    metadata: {
      characterCount: 0,
      variableCount: 0
    }
  }
]

/**
 * Load sample templates into localStorage (for testing)
 */
export function loadSampleTemplates() {
  const { saveTemplate } = require('@/utils/templateStorage')
  
  sampleTemplates.forEach(template => {
    // Calculate metadata
    const characterCount = template.content.length
    const variableCount = (template.content.match(/\{[^}]+\}/g) || []).length
    
    const templateWithMetadata = {
      ...template,
      metadata: {
        characterCount,
        variableCount
      }
    }
    
    saveTemplate(templateWithMetadata)
  })
  
  console.log('Sample templates loaded!')
}

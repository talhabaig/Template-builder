/**
 * Variable definitions for docxtemplater
 * Organized by category for easy browsing in the UI
 */
export const variableCategories = [
  {
    id: 'common',
    name: 'Common',
    icon: '📅',
    variables: [
      { id: 'current_date', label: 'Current Date', syntax: '{current_date}', description: 'The current date' }
    ]
  },
  {
    id: 'case',
    name: 'Case Fields',
    icon: '📋',
    variables: [
      { id: 'case.case_number', label: 'Case Number', syntax: '{case.case_number}', description: 'Civil Action File Number' },
      { id: 'case.refferal_source', label: 'Referral Source', syntax: '{case.refferal_source}', description: 'Court name' },
      { id: 'case.name', label: 'Case Name', syntax: '{case.name}', description: 'Case name' },
      { id: 'case.case_type', label: 'Type', syntax: '{case.case_type}', description: 'Case type' },
      { id: 'case.case_category', label: 'Category', syntax: '{case.case_category}', description: 'Case category' },
      { id: 'case.issues_offenses', label: 'Issues/Offenses', syntax: '{case.issues_offenses}', description: 'Issues or offenses' },
      { id: 'case.county', label: 'County', syntax: '{case.county}', description: 'County name' },
      { id: 'case.adr_process', label: 'ADR Process', syntax: '{case.adr_process}', description: 'ADR process type' },
      { id: 'case.status', label: 'Case Status', syntax: '{case.status}', description: 'Current case status' },
      { id: 'case.disposition_type', label: 'Disposition Type', syntax: '{case.disposition_type}', description: 'Disposition type' },
      { id: 'case.disposition_status', label: 'Disposition Status', syntax: '{case.disposition_status}', description: 'Disposition status' },
      { id: 'case.additional_parties_names', label: 'Additional Parties Names', syntax: '{case.additional_parties_names}', description: 'Names of additional parties' },
      { id: 'case.defendants_names', label: 'Defendant Names', syntax: '{case.defendants_names}', description: 'Names of defendants' },
      { id: 'case.plaintiffs_names', label: 'Plaintiff Names', syntax: '{case.plaintiffs_names}', description: 'Names of plaintiffs' },
      { id: 'case.parties_names', label: 'Parties Names', syntax: '{case.parties_names}', description: 'All parties names' },
      { id: 'case.mediator_selected_by_party', label: 'Mediator Selected by Party', syntax: '{case.mediator_selected_by_party}', description: 'Whether mediator was selected by party' },
      { id: 'case.service_date', label: 'Service Date', syntax: '{case.service_date}', description: 'Case service date' },
      { id: 'case.date_of_offense', label: 'Date of Offense', syntax: '{case.date_of_offense}', description: 'Date of offense' },
      { id: 'case.filling_date', label: 'Filing Date', syntax: '{case.filling_date}', description: 'Case filing date' },
      { id: 'case.initial_session_date', label: 'Initial Session Date', syntax: '{case.initial_session_date}', description: 'Initial session date' },
      { id: 'case.received_case_date', label: 'Received Case Date', syntax: '{case.received_case_date}', description: 'Date case was received' },
      { id: 'case.disposition_date', label: 'Disposition Date', syntax: '{case.disposition_date}', description: 'Disposition date' },
      { id: 'case.referral_date', label: 'Referral Date', syntax: '{case.referral_date}', description: 'Referral date' },
      { id: 'case.deadline_for_adr', label: 'Deadline for ADR', syntax: '{case.deadline_for_adr}', description: 'ADR deadline' },
      { id: 'case.answer_date', label: 'Answer Date', syntax: '{case.answer_date}', description: 'Answer date' },
      { id: 'case.hearing_date', label: 'Hearing Date', syntax: '{case.hearing_date}', description: 'Hearing date' },
      { id: 'case.adr_required', label: 'ADR Required', syntax: '{case.adr_required}', description: 'Whether ADR is required' },
      { id: 'case.neutral_names', label: 'Neutral Names', syntax: '{case.neutral_names}', description: 'Names of neutrals' }
    ]
  },
  {
    id: 'judge',
    name: 'Judge',
    icon: '⚖️',
    variables: [
      { id: 'case.judge.email', label: 'Email', syntax: '{case.judge.email}', description: 'Judge email address' },
      { id: 'case.judge.office', label: 'Phone', syntax: '{case.judge.office}', description: 'Judge phone number' },
      { id: 'case.judge.address', label: 'Address', syntax: '{case.judge.address}', description: 'Judge address' },
      { id: 'case.judge.last_name', label: 'Last Name', syntax: '{case.judge.last_name}', description: 'Judge last name' },
      { id: 'case.judge.first_name', label: 'First Name', syntax: '{case.judge.first_name}', description: 'Judge first name' },
      { id: 'case.judge.middle_name', label: 'Middle Name', syntax: '{case.judge.middle_name}', description: 'Judge middle name' },
      { id: 'case.judge.full_name_for_template', label: 'Full Name', syntax: '{case.judge.full_name_for_template}', description: 'Judge full name' },
      { id: 'case.judge.additional_emails', label: 'Additional Emails', syntax: '{case.judge.additional_emails}', description: 'Additional email addresses' }
    ]
  },
  {
    id: 'owner',
    name: 'Owner',
    icon: '👤',
    variables: [
      { id: 'case.owner.email', label: 'Email', syntax: '{case.owner.email}', description: 'Owner email address' },
      { id: 'case.owner.office', label: 'Phone', syntax: '{case.owner.office}', description: 'Owner phone number' },
      { id: 'case.owner.address', label: 'Address', syntax: '{case.owner.address}', description: 'Owner address' },
      { id: 'case.owner.last_name', label: 'Last Name', syntax: '{case.owner.last_name}', description: 'Owner last name' },
      { id: 'case.owner.first_name', label: 'First Name', syntax: '{case.owner.first_name}', description: 'Owner first name' },
      { id: 'case.owner.middle_name', label: 'Middle Name', syntax: '{case.owner.middle_name}', description: 'Owner middle name' },
      { id: 'case.owner.full_name_for_template', label: 'Full Name', syntax: '{case.owner.full_name_for_template}', description: 'Owner full name' },
      { id: 'case.owner.rate', label: 'Rate', syntax: '{case.owner.rate}', description: 'Owner rate' }
    ]
  },
  {
    id: 'lists',
    name: 'Lists & Loops',
    icon: '🔄',
    variables: [
      {
        id: 'case.neutrals',
        label: 'Neutrals Loop',
        syntax: '{#case.neutrals}...{/case.neutrals}',
        description: 'Loop through all neutrals',
        isLoop: true,
        innerVariables: [
          { id: 'neutral_fee_amount', label: 'Fee Amount', syntax: '{neutral_fee_amount}' },
          { id: 'neutral_additional_payment_information', label: 'Additional Payment Info', syntax: '{neutral_additional_payment_information}' },
          { id: 'neutral_state_certification_number', label: 'State Registration Number', syntax: '{neutral_state_certification_number}' },
          { id: 'neutral_state_registration_categories', label: 'State Registration Categories', syntax: '{neutral_state_registration_categories}' },
          { id: 'email', label: 'Email', syntax: '{email}' },
          { id: 'office', label: 'Phone', syntax: '{office}' },
          { id: 'address', label: 'Address', syntax: '{address}' },
          { id: 'company', label: 'Company', syntax: '{company}' },
          { id: 'last_name', label: 'Last Name', syntax: '{last_name}' },
          { id: 'first_name', label: 'First Name', syntax: '{first_name}' },
          { id: 'middle_name', label: 'Middle Name', syntax: '{middle_name}' },
          { id: 'full_name_for_template', label: 'Full Name', syntax: '{full_name_for_template}' },
          { id: 'additional_emails', label: 'Additional Emails', syntax: '{additional_emails}' }
        ]
      },
      {
        id: 'case.issues',
        label: 'Issues Loop',
        syntax: '{#case.issues}...{/case.issues}',
        description: 'Loop through case issues',
        isLoop: true
      },
      {
        id: 'case.notes',
        label: 'Notes Loop',
        syntax: '{#case.notes}...{/case.notes}',
        description: 'Loop through case notes',
        isLoop: true,
        innerVariables: [
          { id: 'body', label: 'Body', syntax: '{body}' },
          { id: 'last_updated_at', label: 'Last Updated At', syntax: '{last_updated_at}' },
          { id: 'author_full_name', label: 'Author Full Name', syntax: '{author_full_name}' }
        ]
      },
      {
        id: 'case.sessions',
        label: 'Sessions Loop',
        syntax: '{#case.sessions}...{/case.sessions}',
        description: 'Loop through sessions',
        isLoop: true,
        innerVariables: [
          { id: 'status', label: 'Status', syntax: '{status}' },
          { id: 'adr_number_of_hours', label: 'Number of Hours', syntax: '{adr_number_of_hours}' },
          { id: 'session_date', label: 'Date', syntax: '{session_date}' },
          { id: 'session_time', label: 'Time', syntax: '{session_time}' },
          { id: 'neutral_names', label: 'Neutral Names', syntax: '{neutral_names}' },
          { id: 'session_outcome', label: 'Session Outcome', syntax: '{session_outcome}' },
          { id: 'virtual_location_details', label: 'Virtual Location Details', syntax: '{virtual_location_details}' },
          { id: 'location.address', label: 'Location Address', syntax: '{location.address}' },
          { id: 'location.company', label: 'Location Company', syntax: '{location.company}' },
          { id: 'location.adr_office', label: 'Location is ADR Office', syntax: '{location.adr_office}' },
          { id: 'room_number', label: 'Room Number', syntax: '{room_number}' }
        ]
      },
      {
        id: 'case.parties',
        label: 'Parties Loop',
        syntax: '{#case.parties}...{/case.parties}',
        description: 'Loop through all parties',
        isLoop: true,
        innerVariables: [
          { id: 'role', label: 'Role', syntax: '{role}' },
          { id: 'fee_wavier', label: 'Fee Waiver', syntax: '{fee_wavier}' },
          { id: 'email', label: 'Email', syntax: '{email}' },
          { id: 'office', label: 'Phone', syntax: '{office}' },
          { id: 'address', label: 'Address', syntax: '{address}' },
          { id: 'company', label: 'Company', syntax: '{company}' },
          { id: 'last_name', label: 'Last Name', syntax: '{last_name}' },
          { id: 'first_name', label: 'First Name', syntax: '{first_name}' },
          { id: 'middle_name', label: 'Middle Name', syntax: '{middle_name}' },
          { id: 'full_name_for_template', label: 'Full Name', syntax: '{full_name_for_template}' },
          { id: 'screen_date', label: 'Tier 1 Screen Date', syntax: '{screen_date}' },
          { id: 'tier2_screen_date', label: 'Tier 2 Screen Date', syntax: '{tier2_screen_date}' },
          { id: 'domestic_violence', label: 'Domestic Violence', syntax: '{domestic_violence}' },
          { id: 'is_legal_company', label: 'Is Legal Company', syntax: '{is_legal_company}' },
          { id: 'lawyer_names', label: 'Lawyer Names', syntax: '{lawyer_names}' }
        ]
      },
      {
        id: 'case.defendants',
        label: 'Defendants Loop',
        syntax: '{#case.defendants}...{/case.defendants}',
        description: 'Loop through defendants',
        isLoop: true,
        innerVariables: [
          { id: 'role', label: 'Role', syntax: '{role}' },
          { id: 'fee_wavier', label: 'Fee Waiver', syntax: '{fee_wavier}' },
          { id: 'email', label: 'Email', syntax: '{email}' },
          { id: 'office', label: 'Phone', syntax: '{office}' },
          { id: 'address', label: 'Address', syntax: '{address}' },
          { id: 'company', label: 'Company', syntax: '{company}' },
          { id: 'last_name', label: 'Last Name', syntax: '{last_name}' },
          { id: 'first_name', label: 'First Name', syntax: '{first_name}' },
          { id: 'middle_name', label: 'Middle Name', syntax: '{middle_name}' },
          { id: 'full_name_for_template', label: 'Full Name', syntax: '{full_name_for_template}' },
          { id: 'screen_date', label: 'Tier 1 Screen Date', syntax: '{screen_date}' },
          { id: 'tier2_screen_date', label: 'Tier 2 Screen Date', syntax: '{tier2_screen_date}' },
          { id: 'domestic_violence', label: 'Domestic Violence', syntax: '{domestic_violence}' },
          { id: 'is_legal_company', label: 'Is Legal Company', syntax: '{is_legal_company}' },
          { id: 'lawyer_names', label: 'Lawyer Names', syntax: '{lawyer_names}' }
        ]
      },
      {
        id: 'case.plaintiffs',
        label: 'Plaintiffs Loop',
        syntax: '{#case.plaintiffs}...{/case.plaintiffs}',
        description: 'Loop through plaintiffs',
        isLoop: true,
        innerVariables: [
          { id: 'role', label: 'Role', syntax: '{role}' },
          { id: 'fee_wavier', label: 'Fee Waiver', syntax: '{fee_wavier}' },
          { id: 'email', label: 'Email', syntax: '{email}' },
          { id: 'office', label: 'Phone', syntax: '{office}' },
          { id: 'address', label: 'Address', syntax: '{address}' },
          { id: 'company', label: 'Company', syntax: '{company}' },
          { id: 'last_name', label: 'Last Name', syntax: '{last_name}' },
          { id: 'first_name', label: 'First Name', syntax: '{first_name}' },
          { id: 'middle_name', label: 'Middle Name', syntax: '{middle_name}' },
          { id: 'full_name_for_template', label: 'Full Name', syntax: '{full_name_for_template}' },
          { id: 'screen_date', label: 'Tier 1 Screen Date', syntax: '{screen_date}' },
          { id: 'tier2_screen_date', label: 'Tier 2 Screen Date', syntax: '{tier2_screen_date}' },
          { id: 'domestic_violence', label: 'Domestic Violence', syntax: '{domestic_violence}' },
          { id: 'is_legal_company', label: 'Is Legal Company', syntax: '{is_legal_company}' },
          { id: 'lawyer_names', label: 'Lawyer Names', syntax: '{lawyer_names}' }
        ]
      },
      {
        id: 'case.additional_parties',
        label: 'Additional Parties Loop',
        syntax: '{#case.additional_parties}...{/case.additional_parties}',
        description: 'Loop through additional parties',
        isLoop: true,
        innerVariables: [
          { id: 'role', label: 'Role', syntax: '{role}' },
          { id: 'email', label: 'Email', syntax: '{email}' },
          { id: 'office', label: 'Phone', syntax: '{office}' },
          { id: 'address', label: 'Address', syntax: '{address}' },
          { id: 'company', label: 'Company', syntax: '{company}' },
          { id: 'last_name', label: 'Last Name', syntax: '{last_name}' },
          { id: 'first_name', label: 'First Name', syntax: '{first_name}' },
          { id: 'middle_name', label: 'Middle Name', syntax: '{middle_name}' },
          { id: 'full_name_for_template', label: 'Full Name', syntax: '{full_name_for_template}' },
          { id: 'lawyer_names', label: 'Lawyer Names', syntax: '{lawyer_names}' }
        ]
      },
      {
        id: 'selected_session',
        label: 'Selected Session',
        syntax: '{selected_session.*}',
        description: 'Selected session fields',
        isLoop: false,
        innerVariables: [
          { id: 'selected_session.status', label: 'Status', syntax: '{selected_session.status}' },
          { id: 'selected_session.adr_number_of_hours', label: 'Number of Hours', syntax: '{selected_session.adr_number_of_hours}' },
          { id: 'selected_session.session_date', label: 'Date', syntax: '{selected_session.session_date}' },
          { id: 'selected_session.session_time', label: 'Time', syntax: '{selected_session.session_time}' },
          { id: 'selected_session.session_outcome', label: 'Session Outcome', syntax: '{selected_session.session_outcome}' },
          { id: 'selected_session.neutral_names', label: 'Neutral Names', syntax: '{selected_session.neutral_names}' },
          { id: 'selected_session.is_virtual_address', label: 'Location Address', syntax: '{selected_session.is_virtual_address}' },
          { id: 'selected_session.is_virtual_location', label: 'Location Company', syntax: '{selected_session.is_virtual_location}' },
          { id: 'selected_session.location.adr_office', label: 'Location is ADR Office', syntax: '{selected_session.location.adr_office}' },
          { id: 'selected_session.room_number', label: 'Room Number', syntax: '{selected_session.room_number}' }
        ]
      },
      {
        id: 'case.plaintiffs_vs_defendants',
        label: 'Plaintiffs vs Defendants',
        syntax: '{#case.plaintiffs_vs_defendants}...{/case.plaintiffs_vs_defendants}',
        description: 'Loop through plaintiffs vs defendants pairs',
        isLoop: true,
        innerVariables: [
          { id: 'plaintiff.full_name_for_template', label: 'Plaintiff Full Name', syntax: '{plaintiff.full_name_for_template}' },
          { id: 'plaintiff.address', label: 'Plaintiff Address', syntax: '{plaintiff.address}' },
          { id: 'plaintiff.email', label: 'Plaintiff Email', syntax: '{plaintiff.email}' },
          { id: 'plaintiff.office', label: 'Plaintiff Phone', syntax: '{plaintiff.office}' },
          { id: 'defendant.full_name_for_template', label: 'Defendant Full Name', syntax: '{defendant.full_name_for_template}' },
          { id: 'defendant.address', label: 'Defendant Address', syntax: '{defendant.address}' },
          { id: 'defendant.email', label: 'Defendant Email', syntax: '{defendant.email}' },
          { id: 'defendant.office', label: 'Defendant Phone', syntax: '{defendant.office}' }
        ]
      }
    ]
  }
]

/**
 * Get all variables flattened (for search)
 */
export function getAllVariables() {
  const allVars = []
  variableCategories.forEach(category => {
    category.variables.forEach(variable => {
      allVars.push({ ...variable, category: category.name })
      if (variable.innerVariables) {
        variable.innerVariables.forEach(innerVar => {
          allVars.push({ ...innerVar, category: category.name, parent: variable.id })
        })
      }
    })
  })
  return allVars
}

/**
 * Find variable by syntax
 */
export function findVariableBySyntax(syntax) {
  for (const category of variableCategories) {
    for (const variable of category.variables) {
      if (variable.syntax === syntax) {
        return { ...variable, category: category.name }
      }
      if (variable.innerVariables) {
        for (const innerVar of variable.innerVariables) {
          if (innerVar.syntax === syntax) {
            return { ...innerVar, category: category.name, parent: variable.id }
          }
        }
      }
    }
  }
  return null
}

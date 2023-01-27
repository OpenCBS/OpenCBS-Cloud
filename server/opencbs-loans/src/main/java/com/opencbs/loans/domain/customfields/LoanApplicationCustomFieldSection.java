package com.opencbs.loans.domain.customfields;

import com.opencbs.core.domain.customfields.CustomFieldSection;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "loan_application_custom_fields_sections")
public class LoanApplicationCustomFieldSection extends CustomFieldSection<LoanApplicationCustomField> {
}

package com.opencbs.core.domain.customfields;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "companies_custom_fields_sections")
public class CompanyCustomFieldSection extends CustomFieldSection<CompanyCustomField> { }

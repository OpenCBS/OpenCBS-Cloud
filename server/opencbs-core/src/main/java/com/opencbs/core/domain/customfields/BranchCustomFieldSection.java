package com.opencbs.core.domain.customfields;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "branch_custom_fields_sections")
public class BranchCustomFieldSection extends CustomFieldSection<BranchCustomField> { }

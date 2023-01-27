package com.opencbs.core.domain.customfields;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "groups_custom_fields_sections")
public class GroupCustomFieldSection extends CustomFieldSection<GroupCustomField> { }

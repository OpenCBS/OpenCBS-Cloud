package com.opencbs.core.domain.customfields;

import org.hibernate.annotations.Where;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Audited
@Table(name = "groups_custom_fields")
@Where(clause = "deleted = false")
public class GroupCustomField extends CustomField<GroupCustomFieldSection> {
}

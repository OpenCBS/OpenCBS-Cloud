package com.opencbs.core.domain.customfields;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "people_custom_fields_sections")
public class PersonCustomFieldSection extends CustomFieldSection<PersonCustomField> { }
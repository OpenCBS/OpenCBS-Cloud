package com.opencbs.core.mappers.customFields;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.PersonCustomFieldSection;
import com.opencbs.core.mappers.CustomFieldSectionMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class PersonCustomFieldSectionMapper extends CustomFieldSectionMapper<PersonCustomFieldSection, PersonCustomFieldMapper> {

    @Autowired
    public PersonCustomFieldSectionMapper(PersonCustomFieldMapper customFieldMapper) {
        super(customFieldMapper);
    }
}
